// Usage
// node server.js [options]

var express = require('express');
var app = express();
var fs = require('fs');
var httpProxy = require('http-proxy');
var url = require('url');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var crypto = require('crypto');

var VERBOSE = false;

// Process command line
var argv = process.argv;
for (var i = 2; i < argv.length; i++)
{
    var arg = argv[i];
    if (arg === '-h') {
        console.log('Usage: ' + argv[0] + ' ' + argv[1] +
                    ' [-v] [/path/to/document/directory | /path/to/ddd/file]');
        console.log('\nOptions:');
        console.log('    -v    Verbose output');
        console.log('\nIf the path to an existing directory is given, the server will');
        console.log('create doc.ddd in there. Otherwise the path is interpreted as a');
        console.log('file name and the server will attempt to save the DDD code');
        console.log('to this file.\n');
        console.log('If no path is given, a default test document is loaded.');
        return;
    } else if (arg === '-v') {
        VERBOSE = true;
    } else if (arg.indexOf('-') === 0) {
        console.log('Unknown option: ' + arg);
        return 1;
    } else if (arg.trim().length === 0) {
        // Ignored
    } else {
        DOC_DIR = path.resolve(arg);
    }
}

var DEFAULT_DOC_DIR = path.resolve(__dirname + '/test_data');
var DOC_DIR = DOC_DIR || DEFAULT_DOC_DIR;
var DOC_FILENAME = '';
if (fs.existsSync(DOC_DIR) && fs.statSync(DOC_DIR).isDirectory()) {
    DOC_FILENAME = 'doc.ddd';
} else {
    DOC_FILENAME = path.basename(DOC_DIR);
    DOC_DIR = path.dirname(DOC_DIR);
    if (!fs.existsSync(DOC_DIR) || !fs.statSync(DOC_DIR).isDirectory()) {
        console.log('Error: ' + DOC_DIR + ' is not a directory');
        return 1;
    }
}
verbose('Document: ' + DOC_DIR + '/' + DOC_FILENAME);
if (!fs.existsSync(docPath())) {
   fs.writeFileSync(docPath(), 'nil\n');
}

// TEST mode is enabled when no document path (or the path to the test document)
// is given on the command line.
// - A predefined document is available when the server is started.
// - Any editing operation won't be destructive, i.e., the document
//   will be available in its initial state when the server is restarted.
var TEST_MODE = (DOC_DIR === DEFAULT_DOC_DIR);
if (TEST_MODE) {
    verbose('Test mode is ON (default document will be preserved on restart)');
}

var IMAGES_DIR = DOC_DIR + '/images';
var preserve_files = [];
if (TEST_MODE) {
    // DEBUG: to facilitate testing, these files (under IMAGES_DIR) can't be deleted
    // => each time the server is restarted the configuration is the same
    preserve_files = [ 'small.png', 'big.png', 'Lenna.png' ];
}

function docPath() {
    return DOC_DIR + '/' + DOC_FILENAME;
}

function jsonFilePath(name, saving)
{
    saving = saving || false;
    switch (name) {
        case 'pages' :
            return docPath().replace(/\.ddd$/, '') + '.json' + (TEST_MODE && saving ? '.saved' : '');

        case 'images':
            return docPath().replace(/\.ddd$/, '') + '_images.json' + (TEST_MODE && saving ? '.saved' : '');

        default:
            throw('Unexpected file name');
    }
}

// Required to parse JSON body in REST requests
app.use(express.bodyParser());
// i18n
// A session cookie is used to save the UI language that is set in the query parameters
// when the user connects to the main page (index.html?lang=*).
// Then, every request comming from the same browser, including requests to the REST API,
// will have this cookie. The server uses this value to write a header in the
// generated .ddd file in the user's language.
// BUG: due to the per-browser nature of the cookie (not per-window/per-tab),
// if two tabs with different language specifications are opened, the last one wins.
// That is: if you open index.html?lang=en then index.html?lang=fr in a separate tab,
// then update the document from the first one, the server will save in french.
// Of course this has no effect on the language on the client side (both tabs remain
// in the expected language).
// Another option would be to modify the client side so that is always sends a ?lang=*
// parameter in its REST requests.
app.use(express.cookieParser());

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
        verbose('Page ' + page.id + ' created (index ' + idx + ')');
        save(pages, req);
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
                verbose('Page ' + found.id + ' updated');
                break;
            }
        }
        if (found && found.idx !== -1) {
            // Move page:
            // - delete from previous position
            pages.splice(i, 1);
            // - insert at new position
            pages.splice(found.idx, 0, found);
            verbose('Page ' + found.id + ' moved from index ' + i + ' to index ' + found.idx);
            // - no need to keep the idx attribute in the page
            delete found.idx;
        }
        if (found)
            save(pages, req);
        res.send(found ? found : 404);
    });
});

app.delete('/pages/:id', function(req, res) {
    getData('pages', function(err, pages) {
        var found = false;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].id == req.params.id) {
                verbose('Page ' + req.params.id + ' deleted (index ' + i + ')');
                pages.splice(i, 1);
                save(pages, req);
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
        verbose('Image ' + image.id + ' created');
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
                verbose('Image ' + found.id + ' updated');
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
                verbose('Image ' + req.params.id + ' deleted');
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
            // Do not use fs.rename() due to possible EXDEV
            var is = fs.createReadStream(req.files.file.path);
            var os = fs.createWriteStream(IMAGES_DIR + '/' + name);
            is.pipe(os);
            is.on('end',function() {
                fs.unlink(req.files.file.path);
                res.send(JSON.stringify({ success: true, file: name }));
            });
        }
        fs.exists(IMAGES_DIR, function(exists) {
            if (exists) {
                rename();
            } else {
                verbose('Creating ' + IMAGES_DIR);
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

// Root document (index*.html) contains EJS markup for i18n

app.get(/^\/+(index.*\.html|)$/, function(req, res) {
    var path = req.params[0];
    if (path === '')
        path = 'index.html';

    fs.readFile(__dirname + '/../www/' + path, { encoding: 'utf8' }, function(err, data) {
        if (err)
            return res.send(404);
        var lang = req.query.lang || 'en';
        function titleString() {
            switch (lang) {
                case 'fr':
                    return 'Éditeur Tao Presentations';
                default:
                    console.log("titleString() Unsupported language '" + lang + "', using 'en'");
                    // Fallthrough
                case 'en':
                    return 'Tao Presentations Editor';
            }
        }
        var options = {
            locals: {
                setLanguage: function() {
                    if (!req.query.lang)
                        return '';
                    verbose(path + ": language is '" + req.query.lang +"'");
                    return '<script type="text/javascript" src="ext-4/locale/ext-lang-' + req.query.lang + '.js"></script>' +
                           '<script type="text/javascript">var TE_lang = "' + req.query.lang + '";</script>';
                },
                title: DOC_FILENAME + ' - ' + titleString()
            }
        };
        res.cookie('taoeditorlang', lang);
        res.send(ejs.render(data, options));
    });
});

// Serve static files

app.use(express.static( __dirname + '/../www'));

// Proxy themes not available locally

/*
Testing
cd ~/work/tao/webui/webui
mv www/app/themes/blueclaire www/app/themes/blueclaire_
mv server/export/blueclaire server/export/blueclaire_
mkdir ~/Sites/my_blue
cd ~/Sites/my_blue
ln -s ~/work/tao/webui/webui/www/app/themes/blueclaire_ client
ln -s ~/work/tao/webui/webui/server/export/blueclaire_ server
*/
var THEME_BASE_URL = {
    // Example:
    // - (Client files) Forward incoming HTTP requests for /app/themes/blueclaire/*
    //   to http://localhost/~jerome/my_blue/client/*
    // - (Server files) GET .ddd generation code from:
    //   http://localhost/~jerome/my_blue/server/<PageName>.js
    //'blueclaire': 'http://localhost/~jerome/my_blue'
};

var proxy = new httpProxy.RoutingProxy();
Object.keys(THEME_BASE_URL).forEach(function(theme) {

    verbose('Remote theme \'' + theme + '\' at: ' + THEME_BASE_URL[theme]);

    app.use('/app/themes/' + theme, function(req, res) {
        var dest = url.parse(THEME_BASE_URL[theme]);
        req.url = dest.pathname + '/client/' + req.url;
        req.headers.host = dest.host;
        proxy.proxyRequest(req, res, {
            host: dest.host,
            port: dest.port || 80
        })
    });
});

// Start server

var server = http.createServer(app);
var PORT = process.env.PORT || 3000;
var currentPort = PORT;
server.on('error', function(err) {
    if (currentPort === PORT + 10) {
        // No luck, ask for a dynamic port
        currentPort = 0;
    } else if (currentPort === 0) {
        // listen(0) failed
        throw 'Could not start server';
    } else {
        currentPort++;
    }
    server.listen(currentPort);
});
server.on('listening', function() {
    // If you change this message, change it also in tao/webui.cpp
    console.log('Server listening on port ' + server.address().port);
});
server.listen(currentPort);


// Helpers

// Data loaded from/saved to JSON files
var cached = {
    pages: {
        pages: null,
        dddmd5: null // overwrite empty or 'nil' file only (except TEST_MODE)
    },
    images: {
        images: null
    }
};

// Read and cache JSON file (name = 'pages' or 'images')
// Example: getData('pages', function(error, pages) { ... } )
function getData(name, callback)
{
    if (cached[name][name] !== null) {
        callback(null, cached[name][name]);
    } else {
        var file = jsonFilePath(name);
        fs.exists(file, function(exists) {
            if (!exists) {
                console.log(file + ' does not exist');
                cached[name][name] = [];
                callback(null, []);
            } else {
                fs.readFile(file, 'utf8', function (err, data) {
                    if (err) {
                        console.log('File read error: ' + err);
                        callback(err);
                    } else {
                        if (data.trim().length === 0) {
                            console.log(file + ' is empty');
                            cached[name][name] = [];
                        } else {
                            cached[name] = JSON.parse(data);
                        }
                        callback(null, cached[name][name]);
                    }
                });
            }
        })
    }
}

// Save all pages to DDD document and JSON file
// req is the original HTTP request (may be used to retrieve language)
function save(pages, req)
{
    var lang = req.cookies['taoeditorlang'] || 'en';
    var sum = writeTaoDocument(pages, lang);
    if (sum)
        savePagesJSON(pages, sum);
}

// Save pages to JSON file
function savePagesJSON(pages, dddmd5sum)
{
    var path = jsonFilePath('pages', true);
    verbose('Saving ' + path);
    cached.pages.pages = pages;
    var sav = {
        dddmd5: dddmd5sum,
        pages: pages
    }
    fs.writeFileSync(path, JSON.stringify(sav));
}

function saveImages(images)
{
    var path = jsonFilePath('images', true);
    verbose('Saving ' + path);
    cached.images.images = images;
    var sav = {
        images: images
    }
    fs.writeFileSync(path, JSON.stringify(sav));
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
            verbose('Debug: file ' + name + ' not deleted (in preserve_files)');
            callback();
        } else {
            verbose('Delete image file: ' + name);
            fs.unlink(IMAGES_DIR + '/' + name, callback);
        }
    } else {
        // name is a URL, nothing to do
        callback();
    }
}

var exporter = [];
var loadInProgress = 0;
var forceReload = true; // Do not reuse files from cache after restart
// Returns MD5 of saved file or null on error or if asynchronous operation is in progress
function writeTaoDocument(pages, lang)
{
    var prevmd5 = cached.pages.dddmd5;
    var md5;
    try {
        var ddd = fs.readFileSync(docPath(), 'utf8');
        if (ddd.trim().length === 0 || ddd.trim() === 'nil')
            md5 = prevmd5; // allow overwrite
        else if (prevmd5 === null && TEST_MODE)
            md5 = null;    // allow overwrite
        else
            md5 = crypto.createHash('md5').update(ddd).digest('hex');
    } catch (e) {
        md5 = prevmd5;
    }
    if (md5 !== prevmd5) {
        console.log('MD5 sum of ' + docPath() + ' differs from the value it had when ' +
                    'last saved (file not modified by us).\n' +
                    'Will NOT overwrite file. Delete .ddd and save again if you wish.');
        return null;
    }

    var missing = [];
    var getTmpl = function(page)
    {
        var kind = page.kind;
        return exporter[kind] || (exporter[kind] = loadExporter(kind));

        function loadExporter(kind)
        {
            // Example: 'vellum.TitleAndSubtitle' => './export/vellum/TitleAndSubtitle'
            var modname = __dirname + '/export/' + kind.replace('.', '/');
            var modfile = modname + '.js';
            if (fs.existsSync(modfile) === false)
                return loadExporterFromCache(kind);
            verbose('Loading ' + modname);
            return require(modname);
        }

        function loadExporterFromCache(kind)
        {
            var modname = __dirname + '/export_cache/' + kind.replace('.', '/');
            var modfile = modname + '.js';
            if (fs.existsSync(modfile) === false || forceReload)
            {
                function error(msg) {
                    if (msg)
                        console.log(msg);
                    if (missing.indexOf(kind) == -1)
                        missing.push(kind);
                    var empty = function() { return ''; }
                    return { header: empty, generate: empty };
                }
                var dot = kind.indexOf('.');
                var theme = kind.substring(0, dot);
                if (THEME_BASE_URL.hasOwnProperty(theme))
                {
                    var file = kind.substring(dot + 1) + '.js';
                    var dst = THEME_BASE_URL[theme] + '/server/' + file;
                    var dstu = url.parse(dst);
                    verbose('Fetching ' + dst);

                    function createDir(dir)
                    {
                        if (!fs.existsSync(dir))
                        {
                            verbose('Creating ' + dir);
                            fs.mkdirSync(dir);
                        }
                        return true;
                    }
                    var cachedir = __dirname + '/export_cache';
                    if (!createDir(cachedir))
                        return;
                    var themedir = cachedir + '/' + theme;
                    if (!createDir(themedir))
                        return;
                    var filepath = themedir + '/' + file;

                    function beginLoad()
                    {
                        loadInProgress++;
                    }
                    function endLoad()
                    {
                        if (--loadInProgress === 0) {
                            writeTaoDocument(pages, lang);
                        }
                    }
                    beginLoad();
                    (function (buffer, dstpath, modname) {
                        http.get({ host: dstu.host, port: dstu.port || 80, path: dstu.path },
                            function(res) {
                                res.on('data', function(chunk) {
                                    buffer += chunk;
                                });
                                res.on('end', function() {
                                    verbose('Saving ' + dstpath);
                                    fs.writeFile(dstpath, buffer, function(err) {
                                        if (err) {
                                            console.log(err);
                                            endLoad();
                                            return;
                                        }
                                        try {
                                            exporter[kind] = require(modname);
                                        } catch (e) {
                                            console.log('require() failed');
                                            return;
                                        }
                                        verbose('Exporter for ' + kind + ' loaded');
                                        endLoad();
                                    });
                                })
                        }).on('error', function(e) {
                            console.log('Download failed [' + dst + ']');
                            endLoad();
                        });
                    }('', filepath, modname));
                    return error('Download in progress');
                }
                return error('No local file nor remote URL for ' + kind);
            }
            return require(modname);
        }
    }

    var ddd;
    if (lang === 'fr') {
        ddd = "// Document généré par l'Éditeur Tao depuis le fichier\n" +
              "// "+ path.basename(jsonFilePath('pages', true)) +
              " le " + (new Date()).toISOString() + ".\n//\n" +
              "// NE MODIFIEZ PAS ce fichier manuellement, sauf si vous comptez ne plus utiliser\n" +
              "// l'Éditeur Tao pour faire d'autres modifications. En effet, l'éditeur n'écrase\n" +
              "// jamais un fichier modifié.\n\n"
    } else {
        ddd = '// Document generated by the Tao Editor from file\n' +
              '// '+ path.basename(jsonFilePath('pages', true)) +
              ' on ' + (new Date()).toISOString() + '.\n//\n' +
              '// DO NOT EDIT this file manually, unless you plan to stop using the\n' +
              '// Tao Editor to further change the document. Indeed, the editor will not\n' +
              '// overwrite a modified file.\n\n'
    }
    var ctx = {};
    for (var i = 0; i < pages.length; i++)
    {
        var page = pages[i];
        var tmpl = getTmpl(page);
        if (!tmpl)
            return null;  // Async GET in progress, will retry on complettion
        ddd += tmpl.header(ctx);
    }

    for (var i = 0; i < pages.length; i++)
    {
        var page = pages[i];
        var tmpl = getTmpl(page);
        if (!tmpl)
            return null;
        ddd += tmpl.generate(page);
    }

    var warn = '';
    if (missing.length !== 0)
    {
        warn = ' with error: missing output module(s) for page kind(s): ' + missing.toString();
    }
    return writeDDD(ddd, warn);
}


// Write text to .ddd file and update cached MD5 sum
function writeDDD(ddd, warn)
{
    var file = docPath();
    warn = warn || '';
    fs.writeFileSync(file, ddd);
    verbose(file + ' saved' + warn);
    cached.pages.dddmd5 = crypto.createHash('md5').update(ddd).digest('hex');
    return cached.pages.dddmd5;
}

function verbose()
{
    if (VERBOSE)
        console.log.apply(console, arguments);
}
