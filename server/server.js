// Usage
// node server.js [path/to/document/directory]

var express = require('express');
var app = express();
var fs = require('fs');
var httpProxy = require('http-proxy');
var url = require('url');

var DOC_DIR = process.argv[2] || __dirname + '/data';
if (DOC_DIR[0] !== '/')
    DOC_DIR = __dirname + '/' + DOC_DIR;
console.log('Document directory: ' + DOC_DIR);

var IMAGES_DIR = DOC_DIR + '/images';
// DEBUG: to facilitate testing, these files (under IMAGES_DIR) can't be deleted
// => each time the server is restarted the configuration is the same
var preserve_files = [ 'small.png', 'big.png', 'Lenna.png' ];

// Required to parse JSON body in REST requests
app.use(express.bodyParser());

// REST API
//
//                   ------------------ Method ---------------------
//                   POST          GET        PUT         DELETE
// Resource          (Create)      (Read)     (Update)    (Delete)
//
// /pages            Create one    List all   Not used    Not used 
// /pages/:id        Error         Get one    Update one  Delete one
//
// /images           [like pages]
// /images/:id       [like pages]

app.get('/pages', function(req, res) {
    getData('pages', function(err, pages) {
        res.send(err ? 500 : pages);
    });
});

app.get('/pages/:id', function(req, res) {
    getData('pages', function(err, pages) {
        var found = [];
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].id == req.params.id) {
                found.push(pages[i]);
            }
        }
        res.send(found.length === 1 ? found : 404);
    });
});

app.post('/pages', function (req, res) {
    getData('pages', function(err, pages) {
        var page = req.body;
        page.id = allocateId(pages);

        var idx = pages.length; // Insert at end by default
        if (page.idx !== -1) {
            // Store at index specified by client
            idx = page.idx
            delete page.idx;
        }
        pages.splice(idx, 0, page);
        console.log('Page ' + page.id + ' created (index ' + idx + ')');
        save(pages);
        var rsp = { success: true, pages: [] };
        rsp.pages[0] = page;
        res.send(rsp);
    });
});

app.put('/pages/:id', function(req, res) {
    getData('pages', function(err, pages) {
        var found = null;
        var i = 0;
        for (i = 0; i < pages.length; i++) {
            if (pages[i].id == req.params.id) {
                found = pages[i] = req.body;
                console.log('Page ' + found.id + ' updated');
                break;
            }
        }
        if (found && found.idx !== -1) {
            // Move page:
            // - delete from previous position
            pages.splice(i, 1);
            // - insert at new position
            pages.splice(found.idx, 0, found);
            console.log('Page ' + found.id + ' moved from index ' + i + ' to index ' + found.idx);
            // - no need to keep the idx attribute in the page
            delete found.idx;
        }
        if (found)
            save(pages);
        res.send(found ? found : 404);
    });
});

app.delete('/pages/:id', function(req, res) {
    getData('pages', function(err, pages) {
        var found = false;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].id == req.params.id) {
                console.log('Page ' + req.params.id + ' deleted (index ' + i + ')');
                pages.splice(i, 1);
                save(pages);
                found = true;
            }            
        }
        res.send(found ? { success: true } : 404);
    });
});


app.get('/images', function(req, res) {
    getData('images', function(err, pages) {
        res.send(err ? 500 : pages);
    });
});

app.post('/images', function (req, res) {
    getData('images', function(err, images) {
        var image = req.body;
        image.id = allocateId(images);
        images.push(image);
        console.log('Image ' + image.id + ' created');
        saveImages(images);
        var rsp = { success: true, images: [] };
        rsp.images[0] = image;
        res.send(rsp);
    });
});

app.put('/images/:id', function(req, res) {
    getData('images', function(err, images) {
        var prevfile, found = null;
        var i = 0;
        for (i = 0; i < images.length; i++) {
            if (images[i].id == req.params.id) {
                prevfile = images[i].file;
                found = images[i] = req.body;
                console.log('Image ' + found.id + ' updated');
                break;
            }
        }
        if (found) {
            saveImages(images);
            if (prevfile.indexOf('://') === -1 && prevfile !== found.file) {
                deleteImageFile(prevfile, function (err) {
                    res.send(err ? 500 : found);
                });
            } else {
                res.send(found);
            }
        } else {
           res.send(404);
    }
    });
});

app.delete('/images/:id', function(req, res) {
    getData('images', function(err, images) {
        var found = undefined;
        for (var i = 0; i < images.length; i++) {
            if (images[i].id == req.params.id) {
                console.log('Image ' + req.params.id + ' deleted');
                found = images[i];
                images.splice(i, 1);
                saveImages(images);
            }
        }
        if (found) {
            deleteImageFile(found.file, function(err) {
                res.send(err ? 500 : { success: true })
            })
        } else {
            res.send(404);
        }
    });
});

app.post('/image-upload', function(req, res, next) {
    // req.files.<name of form field>
    if (typeof req.files.file === undefined)
    {
        res.send(400);
        return;
    }

    findUnusedImageFileName(req.files.file.name, function(err, name) {
        if (err)
            throw err;

        var rename = function() {
            fs.rename(req.files.file.path, IMAGES_DIR + '/' + name, function(err) {
                    if (err)
                        throw err;
                    res.send(JSON.stringify({ success: true, file: name }));
                }
            );
        }
        fs.exists(IMAGES_DIR, function(exists) {
            if (exists) {
                rename();
            } else {
                console.log('Creating ' + IMAGES_DIR);
                fs.mkdir(IMAGES_DIR, function(err) {
                    if (err)
                        throw err;
                    rename();
                });
            }
        })
    });
});

// Accessing the image library

app.use('/imagelibrary', express.static(IMAGES_DIR));

// Serve static files

app.use(express.static( __dirname + '/../www'));

// Proxy themes not available locally

var THEME_BASE_URL = {
    // Example:
    // Forward /app/themes/mytheme/* to http://host/some/path/*
    'mytheme': 'http://host/some/path'
};

var proxy = new httpProxy.RoutingProxy();
Object.keys(THEME_BASE_URL).forEach(function(theme) {

    console.log('Proxying rule: theme \'' + theme + '\' (/app/themes/' +
                theme + '/*) is at: ' + THEME_BASE_URL[theme]);

    app.use('/app/themes/' + theme, function(req, res) {
        var dest = url.parse(THEME_BASE_URL[theme]);
        req.url = dest.pathname + '/' + req.url;
        req.headers.host = dest.host;
        proxy.proxyRequest(req, res, {
            host: dest.host,
            port: dest.port || 80
        })
    });
});

// Start server

var PORT = process.env.PORT || 3000;
app.listen(PORT, null, function() {
    console.log('Server listening on port ' + PORT);
});


// Helpers

// Read and cache <name>.json
// Example: getData('pages', function(error, pages) { ... } )
var cached = {
    pages: null,
    images: null
}
function getData(name, callback)
{
    if (cached[name] !== null) {
        callback(null, cached[name]);
    } else {
        var file = DOC_DIR + '/' + name + '.json';
        fs.exists(file, function(exists) {
            if (!exists) {
                console.log(file + ' does not exist');
                cached[name] = [];
                callback(null, cached[name]);
            } else {
                fs.readFile(file, 'utf8', function (err, data) {
                    if (err) {
                        console.log('File read error: ' + err);
                        callback(err);
                    } else {
                        if (data.trim().length === 0)
                            data = '[]';
                        cached[name] = JSON.parse(data);
                        callback(null, cached[name]);
                    }
                });
            }
        })
    }
}

function save(pages)
{
    var path = DOC_DIR + '/saved_pages.json';
    console.log('Saving ' + path);
    cached.pages = pages;
    fs.writeFileSync(path, JSON.stringify(pages));
    writeTaoDocument(pages);
}

function saveImages(images)
{
    var path = DOC_DIR + '/saved_images.json';
    console.log('Saving ' + path);
    cached.images = images;
    fs.writeFileSync(path, JSON.stringify(images));
}

function allocateId(arr)
{
    var ids = {};
    arr.forEach(function(elt) {
        ids[elt.id] = 1;
    });
    var id = 1;
    while (id in ids)
        id++;
    return id;
}

// If file name exists in image directory, generate modified name. Otherwise keep name.
// Call callback(err, unused_name)
function findUnusedImageFileName(name, callback)
{
    fs.exists(IMAGES_DIR + '/' + name, function(exists) {
        if (exists) {
            var dot = name.indexOf('.');
            var left = name.substring(0, dot);
            var right = name.substring(dot + 1);
            findUnusedImageFileName(left + '@.' + right, callback);
        } else {
            callback(undefined, name);
        }
    });
}

// If name is a file in IMAGES_DIR and is not in the 'preserve' list, delete it
function deleteImageFile(name, callback)
{
    if (name.indexOf('://') === -1) {
        if (preserve_files.indexOf(name) !== -1) {
            console.log('Debug: file ' + name + ' not deleted (in preserve_files)');
            callback();
        } else {
            console.log('Delete image file: ' + name);
            fs.unlink(IMAGES_DIR + '/' + name, callback);
        }
    } else {
        // name is a URL, nothing to do
        callback();
    }
}

function writeTaoDocument(pages)
{
    var missing = [];
    var getTmpl = function(page)
    {
        // Example: 'vellum.TitleAndSubtitle' => './export/vellum/TitleAndSubtitle'
        var modname = './export/' + page.kind.replace('.', '/');
        var modfile = modname + '.js';
        if (fs.existsSync(modfile) === false)
        {
            if (missing.indexOf(page.kind) == -1)
                missing.push(page.kind);
            var empty = function() { return ''; }
            return { header: empty, generate: empty };
        }

        return require(modname);
    }

    var ddd = '';
    var ctx = {};
    for (var i = 0; i < pages.length; i++)
    {
        var page = pages[i];
        ddd += getTmpl(page).header(ctx);
    }

    for (var i = 0; i < pages.length; i++)
    {
        var page = pages[i];
        ddd += getTmpl(page).generate(page);
    }

    var file = DOC_DIR + '/doc.ddd';
    fs.writeFileSync(file, ddd);

    var err = '';
    if (missing.length !== 0)
    {
        err = ' with error: missing output module(s) for page kind(s): ' + missing.toString();
    }
    console.log(file + ' saved' + err);
}
