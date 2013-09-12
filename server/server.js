var express = require('express');
var app = express();
var fs = require('fs');

var IMAGES_DIR = __dirname + '/data/images';

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
        var found = null;
        var i = 0;
        for (i = 0; i < images.length; i++) {
            if (images[i].id == req.params.id) {
                found = images[i] = req.body;
                console.log('Image ' + found.id + ' updated');
                break;
            }
        }
        if (found)
            saveImages(images);
        res.send(found ? found : 404);
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
            var success = { success: true };
            if (found.file.indexOf('://') === -1) {
                fs.unlink(IMAGES_DIR + '/' + found.file, function(err) {
                    res.send(err ? 500 : success);
                });
            }
            res.send(success);
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
        fs.rename(req.files.file.path, IMAGES_DIR + '/' + name, function(err) {
                if (err)
                    throw err;
                res.send(JSON.stringify({ success: true, file: name }));
            }
        );
    });
});

// Accessing the image library

app.use('/imagelibrary', express.static(IMAGES_DIR));

// Serve static files

app.use(express.static( __dirname + '/../www'));

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
        var file = __dirname + '/data/' + name + '.json';
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
}

function save(pages)
{
    cached.pages = pages;
    fs.writeFileSync(__dirname + '/data/saved_pages.json', JSON.stringify(pages));
    writeTaoDocument(pages);
}

function saveImages(images)
{
    cached.images = images;
    fs.writeFileSync(__dirname + '/data/saved_images.json', JSON.stringify(images));
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

    var file = __dirname + '/data/doc.ddd';
    fs.writeFileSync(file, ddd);

    var err = '';
    if (missing.length !== 0)
    {
        err = ' with error: missing output module(s) for page kind(s): ' + missing.toString();
    }
    console.log(file + ' saved' + err);
}
