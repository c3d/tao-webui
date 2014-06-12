// ****************************************************************************
//  server.js                                                      Tao project
// ****************************************************************************
//
//   File Description:
//
//    Application server to build the user interface for Tao
//
//
//
//
//
//
//
//
// ****************************************************************************
//  (C) 2014 Christophe de Dinechin <christophe@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

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
var async = require('async');
var querystring = require('querystring');
var fields = require('./fields');
var templates = require('./templates');

var VERBOSE = false;
var CONVERT_AND_EXIT = false;
var token = null;

var ddtFileCache = [];


// ============================================================================
// 
//    Command line processing
// 
// ============================================================================

var argv = process.argv;
for (var i = 2; i < argv.length; i++)
{
    var arg = argv[i];
    if (arg === '-h') {
        console.log('Usage: ' + argv[0] + ' ' + argv[1] +
                    ' [-v] [-t token | -c] [/path/to/document/directory | /path/to/ddd/file]');
        console.log('\nOptions:');
        console.log('    -v    Verbose output');
        console.log('    -t    Set security token. Client should connect to http://<host>/?token=<token>.');
        console.log('          When this option is set, incoming requests must bear the specified token value');
        console.log('          either in the query string (token=<token>) or in a cookie called \'token\'.');
        console.log('          Requests void of the security token are rejected with HTTP status 401.');
        console.log('          A request to the home page with the token in the query string is redirected');
        console.log('          to the same URL with the \'token\' parameter removed (and the cookie set).');
        console.log('    -c    Convert JSON file to DDD and exit.');
        console.log('\nIf the path to an existing directory is given, the server will');
        console.log('create doc.ddd in there. Otherwise the path is interpreted as a');
        console.log('file name and the server will attempt to save the DDD code');
        console.log('to this file.\n');
        console.log('If no path is given, a default test document is loaded.');
        return;
    } else if (arg === '-v') {
        VERBOSE = true;
    } else if (arg === '-t') {
        token = argv[++i] || null;
        if (!token) {
            console.log('Missing security token value');
            return 1;
        }
    } else if (arg == '-c') {
        CONVERT_AND_EXIT = true;
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
var MOVIES_DIR = DOC_DIR + '/movies';
var MODELS_DIR = DOC_DIR + '/models';
var FILES_DIR = DOC_DIR + '/files';
var preserve_files = [];
if (TEST_MODE) {
    // DEBUG: to facilitate testing, these files (under IMAGES_DIR) can't be deleted
    // => each time the server is restarted the configuration is the same
    preserve_files = [ 'small.png', 'big.png', 'Lenna.png' ];
}


var cached =
// ----------------------------------------------------------------------------
//   Data loaded from/saved to JSON files
// ----------------------------------------------------------------------------
{
    pages: null,
    resources: null,
    sources: {},
    dddmd5: null
};


fs.mkdirParent = function(dirPath, mode, callback)
// ----------------------------------------------------------------------------
//   Like mkdir, but with the intermediate paths created
// ----------------------------------------------------------------------------
{
    // Call the standard fs.mkdir
    fs.mkdir(dirPath, mode, function(error) {
        // When it fail in this way, do the custom steps
        if (error && error.errno === 34) {
            // Create all the parents recursively
            fs.mkdirParent(path.dirname(dirPath), mode, callback);
            //And then the directory
            fs.mkdirParent(dirPath, mode, callback);
        }
        //Manually run the callback since we used our own callback
        callback && callback(error);
    });
};


var exporter = [];
var forceReload = true; // Do not reuse files from cache after restart

function docPath()
// ----------------------------------------------------------------------------
//  Return the document path
// ----------------------------------------------------------------------------
{
    return DOC_DIR + '/' + DOC_FILENAME;
}


function previewPath(pageId)
// ----------------------------------------------------------------------------
//   Return the path for the preview file
// ----------------------------------------------------------------------------
{
    return docPath()+"-preview-"+pageId+".png";
}


function jsonFilePath(name, saving)
// ----------------------------------------------------------------------------
//   Return the file path for the JSON document
// ----------------------------------------------------------------------------
{
    saving = saving || false;
    switch (name) {
    case 'pages' :
        return docPath().replace(/\.ddd$/, '') + '.json'
            + (TEST_MODE && saving ? '.saved' : '');
        
    case 'resources':
        return docPath().replace(/\.ddd$/, '') + '_resources.json' + (TEST_MODE && saving ? '.saved' : '');
        
    default:
        throw('Unexpected file name');
    }
}

if (CONVERT_AND_EXIT === true) {
    verbose('Converting: ' + jsonFilePath('pages') + " to " + docPath());

    getData('pages', function(err, pages) {
        writeTaoDocument(pages, 'en', function(err, sum) {
            var status = 0;
            if (err) {
                console.error(err);
                status = 1;
            } else {
                savePagesJSON(pages, null);
            }
            process.exit(status);
        }, true /* overwrite */);
    });
    return;
} else if (!fs.existsSync(docPath())) {
   fs.writeFileSync(docPath(), 'nil\n');
}

// Read commands from stdin
var stdinbuf ='';
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(chunk) {
    // It seems 'chunk' is always a full line of text (ending with \n)
    // but I think we cannot be certain, hence the while loop to split
    // multiple lines
    stdinbuf += chunk;
    var i = 0, j;
    var cmd;
    while (i < stdinbuf.length) {
        j = stdinbuf.indexOf('\n', i);
        if (j === -1)
            break;
        cmd = stdinbuf.substring(i, j);
        switch (cmd) {
        case 'quit':
            process.exit();
            break;
        case '':
            break;
        default:
            console.log('? Unknown command: ' + cmd);
        }
        i = j + 1;
    }
    if (j !== -1)
        stdinbuf = stdinbuf.substring(j + 1);
});



// ============================================================================
//
//    Application callbacks
//
// ============================================================================

// Required to parse JSON body in REST requests
app.use(express.bodyParser());

// i18n
// A session cookie is used to save the UI language that is set in the
// query parameters when the user connects to the main page
// (index.html?lang=*).  Then, every request comming from the same
// browser, including requests to the REST API, will have this
// cookie. The server uses this value to write a header in the
// generated .ddd file in the user's language.
// BUG: due to the per-browser nature of the cookie (not
// per-window/per-tab), if two tabs with different language
// specifications are opened, the last one wins.  That is: if you open
// index.html?lang=en then index.html?lang=fr in a separate tab, then
// update the document from the first one, the server will save in
// french.  Of course this has no effect on the language on the client
// side (both tabs remain in the expected language).  Another option
// would be to modify the client side so that is always sends a
// ?lang=* parameter in its REST requests.
app.use(express.cookieParser());


app.use(function(req, res, next)
// ----------------------------------------------------------------------------
// Check security token
// ----------------------------------------------------------------------------
{
    if (token) {
        var tok = req.query.token || req.cookies.token || null;
        if (tok !== token) {
            console.error('Unauthorized - missing/invalid security token', tok);
            return res.send(401);
        }
    }
    next();
})



// ============================================================================
// 
//      REST API
//
// ============================================================================
// 
//                   ------------------ Method ---------------------
//                   POST          GET        PUT         DELETE
// Resource          (Create)      (Read)     (Update)    (Delete)
//
// /pages            Create one    List all   Not used    Not used
// /pages/:id        Error         Get one    Update one  Delete one
//
// /resources        [like pages]
// /resources/:id    [like pages]

app.get('/pages', function(req, res)
// ----------------------------------------------------------------------------
//    Return the list of all pages
// ----------------------------------------------------------------------------
{
    getData('pages', function(err, pages) {
        convertToClientSide(pages);
        if (err)
            console.error("Get page: error ", err);
        res.send(err ? 500 : pages);
    });
});


app.get('/pages/:id', function(req, res)
// ----------------------------------------------------------------------------
//   Get a specific page
// ----------------------------------------------------------------------------
{
    getData('pages', function(err, pages) {
        var found = [];
        var pageIndex = -1;
        for (var i = 0; i < pages.length; i++)
        {
            if (pages[i].id == req.params.id)
            {
                found.push(pages[i]);
                pageIndex = i+1;
            }
        }
        if (pageIndex >= 0)
        {
            fs.writeFileSync(docPath() + '.tao-instrs',
                             'page ' + pageIndex + ' id ' + req.params.id);
            var now = new Date();
            fs.utimesSync(docPath(), now, now);
        }
        if (found.length === 1)
        {
            convertToClientSide(found);
            res.send(found);
        }
        else
        {
            console.error("GOT 404 FROM GET /page/:id " + req.params.id
                          + "\n" + stringify(found));
            res.send(404);
        }
    });
});


app.get('/source/:id', function(req, res)
// ----------------------------------------------------------------------------
//   Get the source for a specific page
// ----------------------------------------------------------------------------
{
    var id = req.params.id;
    var sources = cached.sources;
    if (!sources)
        res.send(404);

    var idSource = sources[id];
    if (!idSource)
        res.send(404);

    res.send(idSource);
});


app.post('/pages', function (req, res)
// ----------------------------------------------------------------------------
//    Create a new page
// ----------------------------------------------------------------------------
{
    getData('pages', function(err, pages) {
        var page = req.body;

        // Pass the page through the template properties to set default fields
        if (page.dynamicfields === '')
            page.dynamicfields = loadPageFromTemplate(page, page.model);

        page.id = allocateId(pages);

        var idx = pages.length; // Insert at end by default
        if (page.idx !== -1) {
            // Store at index specified by client
            idx = page.idx
        }
        pages.splice(idx, 0, page);
        if (page.idx)
            delete page.idx;
        save(pages, req, function(err) {
            var rsp = {};
            if (err) {
                rsp.success = false;
                rsp.status = err;
                rsp.filename = DOC_FILENAME;
                // Remove page that was just added
                pages.splice(idx, 1);
            } else {
                verbose('Page ' + page.id + ' created (index ' + idx + ')');
                rsp.success = true;
                rsp.pages = [ page ];
            }
            res.send(rsp);
        });
    });
});


app.put('/pages/:id', function(req, res)
// ----------------------------------------------------------------------------
//   Update a page
// ----------------------------------------------------------------------------
{
    getData('pages', function(err, pages) {
        var ret, found = null;
        var i = 0;
        var pageIndex = 0;
        convertToClientSide(pages);
        for (i = 0; i < pages.length; i++)
        {
            if (pages[i].id == req.params.id)
            {
                found = req.body;
                pages[i] = found;
                pageIndex = i + 1;
                verbose('Page ' + found.id + ' updated');
                break;
            }
        }
        if (found)
        {
            if (found.idx !== -1)
            {
                // Move page:
                // - delete from previous position
                pages.splice(i, 1);
                // - insert at new position
                pages.splice(found.idx, 0, found);
                verbose('Page ' + found.id +
                        ' moved from index ' + i +
                        ' to index ' + found.idx);
            }
            if (found.idx)
                delete found.idx;
            save(pages, req, function(err) {
                var rsp = {};
                if (err)
                {
                    rsp.success = false;
                    rsp.status = err;
                    rsp.filename = DOC_FILENAME;
                }
                else
                {
                    rsp = found;
                    if (pageIndex >= 0)
                        fs.writeFileSync(docPath() + '.tao-instrs',
                                         'page ' + pageIndex);
                }
                res.send(rsp);
            });
        }
        else
        {
            console.error("GOT 404 FROM PUT /page/:id " + req.params.id);
            res.send(404);
        }
    });
});


app.delete('/pages/:id', function(req, res)
// ----------------------------------------------------------------------------
//   Delete a page
// ----------------------------------------------------------------------------
{
    getData('pages', function(err, pages) {
        var found = false;
        for (var i = 0; i < pages.length; i++) {
            if (pages[i].id == req.params.id) {
                verbose('Page ' + req.params.id + ' deleted (index ' + i + ')');
                fs.unlink(previewPath(req.params.id), function() {});
                pages.splice(i, 1);
                save(pages, req, function(err) {
                    var rsp = {};
                    if (err) {
                        rsp.success = false;
                        rsp.status = err;
                        rsp.filename = DOC_FILENAME;
                    } else {
                        rsp.success = true;
                    }
                    res.send(rsp);
                });
                found = true;
            }
        }
        if (!found)
        {
            console.error("GOT 404 FROM DELETE /page/:id " + req.params.id);
            res.send(404);
        }
    });
});


app.get('/resources', function(req, res)
// ----------------------------------------------------------------------------
//    List all resources
// ----------------------------------------------------------------------------
{
    getData('resources', function(err, resources) {
        if (err)
            console.error("Get /resources error: ", err);
        res.send(err ? 500 : resources);
    });
});


app.post('/resources', function (req, res)
// ----------------------------------------------------------------------------
//    Create a new resource
// ----------------------------------------------------------------------------
{
    getData('resources', function(err, resources) {
        var resource = req.body;
        resource.id = allocateId(resources);
        resources.push(resource);
        verbose('Resource ' + resource.id + ' created ' +
                '(type ' + resource.type + ')');
        saveResources(resources);
        var rsp = { success: true, resources: [] };
        rsp.resources[0] = resource;
        res.send(rsp);
    });
});


app.put('/resources/:id', function(req, res)
// ----------------------------------------------------------------------------
//    Update a single resource
// ----------------------------------------------------------------------------
{
    getData('resources', function(err, resources) {
        var prevfile, prevtype, found = null;
        var i = 0;
        for (i = 0; i < resources.length; i++)
        {
            if (resources[i].id == req.params.id)
            {
                prevfile = resources[i].file;
                prevtype = resources[i].type || 'image';
                found = resources[i] = req.body;
                verbose('Resource ' + found.id + ' updated ' +
                        ' (type ' + prevtype +')');
                break;
            }
        }
        if (found)
        {
            saveResources(resources);
            if (prevfile.indexOf('://') === -1 && prevfile !== found.file)
            {
                deleteResourceFile(prevtype, prevfile, function (err) {
                    if (err)
                        console.error("Put: deleteResourceFile error: ", err);
                    res.send(err ? 500 : found);
                });
            }
            else
            {
                res.send(found);
            }
        }
        else
        {
            console.error("GOT 404 FROM PUT /resources/:id " + req.params.id);
            res.send(404);
        }
    });
});


app.delete('/resources/:id', function(req, res)
// ----------------------------------------------------------------------------
//    Delete a given resource
// ----------------------------------------------------------------------------
{
    getData('resources', function(err, resources) {
        var found = undefined;
        for (var i = 0; i < resources.length; i++)
        {
            if (resources[i].id == req.params.id)
            {
                found = resources[i];
                verbose('Resource ' + found.id + ' deleted ' +
                        ' (type ' + found.type +')');
                resources.splice(i, 1);
                saveResources(resources);
            }
        }
        if (found)
        {
            deleteResourceFile(found.type, found.file, function(err) {
                if (err)
                    console.error("Delete /resources error: ", err);
                res.send(err ? 500 : { success: true })
            })
        }
        else
        {
            console.error("GOT 404 FROM DELETE /resources/:id ", req.params.id);
            res.send(404);
        }
    });
});


app.get('/preview/:id', function(req, res)
// ----------------------------------------------------------------------------
//   Return the preview for the current file
// ----------------------------------------------------------------------------
{
    var pageId = req.params.id;
    var imagePath = previewPath(pageId);

    fs.readFile(imagePath, function (err, data) {
        if (!err) {
            res.set('Content-Type', 'image/png');
            res.send(data);
        }
        else
        {
            getData('pages', function(pagesErr, pages) {
                if (pagesErr) {
                    console.error('File read error: ' + err);
                    res.send(404);
                }
                else
                {
                    var found = false;
                    for (var i = 0; i < pages.length; i++) {
                        var page = pages[i];
                        if (page.id == req.params.id) {
                            var model = page.model;
                            var path = __dirname + '/../themes/' + model;
                            var file = path + ".page.png";
                            fs.readFile(file, function(err, data) {
                                if (!err) {
                                    res.set('Content-Type', 'image/png');
                                    res.send(data);
                                }
                                else
                                {
                                    console.error('Model read error: ' + err);
                                    res.send(404);
                                }
                            });
                        }
                    }
                }
            });
        }
    });
});
        


app.post('/image-upload', fileUpload(IMAGES_DIR));
app.post('/mvimage-upload', fileUpload(IMAGES_DIR));
app.post('/movie-upload', fileUpload(MOVIES_DIR));
app.post('/model-upload', fileUpload(MODELS_DIR));
app.post('/file-upload', fileUpload(FILES_DIR));


function fileUpload(dir)
// ----------------------------------------------------------------------------
//   Upload a file to the proper directory
// ----------------------------------------------------------------------------
{
    function uploadFile(dir, file)
    {
        verbose('Uploading file ' + file.name + ' in ' + dir);
        // Rename the input temporary file, overwriting target file
        // Do not use fs.rename() due to possible EXDEV.
        var is = fs.createReadStream(file.path);
        var os = fs.createWriteStream(dir + '/' + file.name);
        is.pipe(os);
        is.on('end',function() {
            fs.unlink(file.path);
        });
    }

    function uploadAllFiles(req, res)
    {
       try
        {
            if (Array.isArray(req.files.file))
            {
                var names = [];
                req.files.file.forEach(function(file) {
                    uploadFile(dir, file);
                    names.push(file.name);
                });
                res.send(JSON.stringify({ success: true, file: names }));
            }
            else
            {
                var name = req.files.file.name;
                uploadFile(dir, req.files.file);
                res.send(JSON.stringify({ success: true, file: name }));
            }
        }
        catch(e)
        {
            console.error('Uploading file error', e);
            res.send(400);
        }
    }

    return function (req, res, next)
    {
        // req.files.<name of form field>
        if (typeof req.files.file === undefined)
        {
            res.send(400);
            return;
        }

        // Check if we need to create the upload directory
        fs.exists(dir, function(exists) {
            if (exists) {
                uploadAllFiles(req, res);
            } else {
                verbose('Creating ' + dir);
                fs.mkdir(dir, function(err) {
                    if (err)
                        throw err;
                    uploadAllFiles(req, res);
                });
            }
        });

    }
};


function themeAsset(path)
// ----------------------------------------------------------------------------
//  Return a read stream for a given path under /themes
// ----------------------------------------------------------------------------
{
    return fs.createReadStream(__dirname + '/../themes/' + path);
}



// ============================================================================
// 
//    Accessing the image library
// 
// ============================================================================

app.use('/library/images', express.static(IMAGES_DIR));



// ============================================================================
// 
//    Accessing the themes
// 
// ============================================================================

app.use('/app/themes', express.static(__dirname + '/../themes/'));
app.use('/themes', express.static(__dirname + '/../themes/'));
app.get('/list/:kind', function(req, res)
// ----------------------------------------------------------------------------
//   Return the list of themes and page templates
// ----------------------------------------------------------------------------
{
    var filelist = [];
    var rootPath = __dirname + "/../themes";
    var rootPathSlash = rootPath + '/';
    var kind = req.params.kind;
    var templates = [];
    var templateRE = new RegExp('\.' + kind + '\.png$');
    var themeRE = /\.theme\.png$/;

    function strip(name, pattern)
    {
        return name.replace(rootPathSlash, '').replace(pattern, '');
    }

    function getFiles(dir)
    {
        var files = fs.readdirSync(dir);
        var oldLength = templates.length;

        // First find the template files (can be shared across themes)
        for(var i in files)
        {
            if (!files.hasOwnProperty(i))
                continue;
            var name = dir + '/' + files[i];
            if (!fs.statSync(name).isDirectory())
                if (templateRE.test(name))
                    templates.push(strip(name, templateRE));
        }
        // Then find all themes
        for(var i in files)
        {
            if (!files.hasOwnProperty(i))
                continue;
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory())
                getFiles(name);
            else if (themeRE.test(name) && templates.length > 0)
                filelist.push(new Object({
                    theme: strip(name, themeRE),
                    templates: templates
                }));
        }

        // Restore the old templates to previous state
        templates = templates.slice(0, oldLength);
    }

    getFiles(rootPath);
    res.send(JSON.stringify(filelist));
});


app.get(/^\/+(index.*\.html|)$/, function(req, res)
// ----------------------------------------------------------------------------
//   Root document (index*.html) contains EJS markup for i18n
// ----------------------------------------------------------------------------
{
    if (token && req.query.token) {
        // Query to root document has a valid token in query params.
        // Save token in a session cookie and redirect to same URL
        // without the token in the query string (to hide it).
        res.cookie('token', token);
        delete req.query.token;
        var url = req.protocol + '://' + req.headers.host + req.path;
        var qs = querystring.stringify(req.query);
        if (qs !== '')
            url += '?' + qs;
        verbose('Security token set - redirecting to ' + url);
        res.redirect(url);
        return;
    }

    var path = req.params[0];
    if (path === '')
        path = 'index.html';

    fs.readFile(
        __dirname + '/../www/' + path,
        { encoding: 'utf8' },
        function(err, data)
        {
            if (err)
            {
                console.error("GOT 404 FROM GET index " + req.params.id);
                return res.send(404);
            }
            var lang = req.query.lang || 'en';
            function titleString() {
                switch (lang) {
                case 'fr':
                    return 'Éditeur Tao Presentations';
                default:
                    console.log("titleString() Unsupported language '"
                                + lang + "', using 'en'");
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
                        return '<script type="text/javascript" '
                            + 'src="ext-4/locale/ext-lang-'
                            + req.query.lang + '.js"></script>'
                            + '<script type="text/javascript">var TE_lang = "'
                            + req.query.lang + '";</script>';
                    },
                    title: DOC_FILENAME + ' - ' + titleString()
                }
            };
            res.cookie('taoeditorlang', lang);
            res.send(ejs.render(data, options));
        }
    );
});


// Serve static files
app.use(express.static( __dirname + '/../www'));


// ============================================================================
// 
//    Proxy themes (loaded remotely)
// 
// ============================================================================

// Testing:
// Just place a theme directory in a location where it can be served by
// a web server.
var THEME_BASE_URL = {
    'greenclaire': 'http://nano.local/ddd/greenclaire'
};

var proxy = new httpProxy.RoutingProxy();
Object.keys(THEME_BASE_URL).forEach(function(theme) {
    
    verbose('Remote theme \'' + theme + '\' at: ' + THEME_BASE_URL[theme]);
    
    var proxyFunction = function(req, res)
    {
        var dest = url.parse(THEME_BASE_URL[theme]);
        req.url = dest.pathname + req.url;
        req.headers.host = dest.host;
        proxy.proxyRequest(req, res, {
            host: dest.host,
            port: dest.port || 80
        })
    }
    
    app.use('/app/themes/' + theme, proxyFunction);
    app.use('/themes/' + theme, proxyFunction);
});



// ============================================================================
// 
//    Start server
// 
// ============================================================================

var server = http.createServer(app);
var PORT = process.env.PORT || 3000;
var currentPort = PORT;


server.on('error', function(err)
// ----------------------------------------------------------------------------
//    Error handler, used to find a port to use for the server
// ----------------------------------------------------------------------------
{
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


server.on('listening', function()
// ----------------------------------------------------------------------------
//    Emit message indicating URL to use for the server
// ----------------------------------------------------------------------------
{
    // If you change this message, change it also in tao/webui.cpp
    console.log('Server listening on port ' + server.address().port);
});
server.listen(currentPort);




// ============================================================================
// 
//     Helper functions
// 
// ============================================================================

function getData(name, callback)
// ----------------------------------------------------------------------------
// Read and cache JSON file
// ----------------------------------------------------------------------------
// Usage: getData('pages', function(error, pages) { ... } )
// (The name argument can be 'pages' or 'resources')
{
    name = name || '';
    if (name != 'pages' && name != 'resources')
        return callback('Unexpected dataset name: ' + name);

    if (cached[name] !== null)
    {
        callback(null, cached[name]);
    }
    else
    {
        var file = jsonFilePath(name);
        fs.exists(file, function(exists)
        {
            if (!exists)
            {
                console.error(file + ' does not exist');
                cached[name] = [];
                callback(null, []);
            }
            else
            {
                fs.readFile(file, 'utf8', function (err, data)
                {
                    if (err)
                    {
                        console.error('File read error: ' + err);
                        callback(err);
                    }
                    else
                    {
                        if (data.trim().length === 0)
                        {
                            console.log(file + ' is empty');
                            cached[name] = [];
                        }
                        else
                        {
                            try
                            {
                                var saved = JSON.parse(data);
                                cached[name] = saved[name];
                            }
                            catch(e)
                            {
                                console.error("Error parsing data file:",data);
                                cached[name] = { };
                            }
                        }
                        callback(null, cached[name]);
                    }
                });
            }
        })
    }
}


function save(pages, req, callback)
// ----------------------------------------------------------------------------
//   Save all pages to DDD document and JSON file
// ----------------------------------------------------------------------------
// req is the original HTTP request (may be used to retrieve language)
{
    var lang = req.cookies['taoeditorlang'] || 'en';
    var sum = writeTaoDocument(pages, lang, function(err, sum)
    {
        if (err)
            return callback(err);
        savePagesJSON(pages, sum);
        callback(null);
    }, req.query.overwrite || false);
}


function savePagesJSON(pages, dddmd5sum)
// ----------------------------------------------------------------------------
//   Save pages to JSON file
// ----------------------------------------------------------------------------
{
    var path = jsonFilePath('pages', true);
    cached.pages = pages;
    cached.dddmd5 = dddmd5sum;
    convertToServerSide(pages);
    var sav = {
        dddmd5: dddmd5sum,
        pages: pages
    }
    fs.writeFileSync(path, stringify(sav));
    verbose(path + ' saved');
}


function saveResources(resources)
// ----------------------------------------------------------------------------
//    Save the list of resources
// ----------------------------------------------------------------------------
{
    var path = jsonFilePath('resources', true);
    verbose('Saving ' + path);
    cached.resources = resources;
    var sav = {
        resources: resources
    }
    fs.writeFileSync(path, stringify(sav));
}


function allocateId(arr)
// ----------------------------------------------------------------------------
//    Allocate a new page ID when creating a new page
// ----------------------------------------------------------------------------
{
    var ids = {};
    arr.forEach(function(elt)
    {
        ids[elt.id] = 1;
    });
    var id = 1;
    while (id in ids)
        id++;
    return id;
}


function deleteResourceFile(type, name, callback)
// ----------------------------------------------------------------------------
//    Delete resource file unless in the 'preserve' list.
// ----------------------------------------------------------------------------
//    Depending on 'type', IMAGES_DIR or MOVIES_DIR is searched for the file
{
    var dir;
    type = type || 'image';
    switch (type)
    {
    case 'image':   dir = IMAGES_DIR; break;
    case 'mvimage': dir = IMAGES_DIR; break;
    case 'movie':   dir = MOVIES_DIR; break;
    case 'model':   dir = MODELS_DIR; break;
    default:
        var msg = 'Error: unknown resource type ' + type;
        console.error(msg);
        callback(msg)
        return;
    }
    if (name.indexOf('://') === -1)
    {
        if (preserve_files.indexOf(name) !== -1)
        {
            verbose('Debug: file ' + name + ' not deleted (in preserve_files)');
            callback();
        }
        else
        {
            var path = dir + '/' + name;
            verbose('Delete resource file: ' + path);
            fs.unlink(path, callback);
        }
    }
    else
    {
        // name is a URL, nothing to do
        callback();
    }
}


function writeTaoDocument(pages, lang, callback, overwrite)
// ----------------------------------------------------------------------------
//    Write the .ddd file for the given pages
// ----------------------------------------------------------------------------
//    callback(err [, sum])
{
    overwrite = overwrite || false;

    if (!overwrite)
    {
        // Check cached MD5 sum, if different, don't overwrite (changed by user)
        var prevmd5 = cached.dddmd5;
        var md5;
        try
        {
            var ddd = fs.readFileSync(docPath(), 'utf8');
            if (ddd.trim().length === 0 || ddd.trim() === 'nil')
                md5 = prevmd5; // allow overwrite
            else if (prevmd5 === null)
                md5 = null;    // allow overwrite
            else
                md5 = crypto.createHash('md5').update(ddd).digest('hex');
        }
        catch (e)
        {
            md5 = prevmd5;
        }
        if (md5 !== prevmd5)
        {
            console.log('MD5 sum of ' + docPath()
                        + ' differs from the value it had when '
                        + 'last saved (file not modified by us).\n'
                        + 'Will NOT overwrite file. '
                        + 'Delete .ddd and save again if you wish.');
            return callback('ERR_FILECHANGED');
        }
    }

    var missing = [];

    function getTemplateExporter(page, callback)
    {
        var model = page.model;
        var key = model;
        if (key in exporter)
            return callback(null, exporter[key]);

        loadExporter(model, function (err, obj) {
            if (err)
                return callback(err);
            exporter[key] = obj;
            callback(null, obj);
        });

        function loadExporter(model, callback)
        {
            // First check if there is a specialized version
            var template = ddtFilePath(model);
            if (!template)
                return callback('Template file not found', model);

            var exportsPath = __dirname + '/exports';
            var obj = templates.processTemplatePath(template,model,exportsPath);
            verbose("Exported from template: " + template);
            callback(null, obj);
        }
    }

    var headerPath = __dirname + '/exports/header-' + lang + '.txt';
    if (!fs.existsSync(headerPath))
        headerPath = __dirname + '/exports/header-en.txt'
    var ddd = fs.readFileSync(headerPath, 'utf8');
    var ctx =
        {
            header: '',
            docPath: docPath(),
            themeAsset: themeAsset,
            ddtFilePath: ddtFilePath,
            verbose: verbose
        };
    var body = '';

    convertToServerSide(pages);
    async.eachSeries(
        pages,
        function(page, cb) {
            getTemplateExporter(page, function(err, tmpl) {
                if (err)
                    return cb(err);
                var header = ctx.header;
                ctx.header = '';
                page.ctx = ctx;
                var pageBody = tmpl(page);
                body += pageBody;
                cached.sources[page.id] = ctx.header + pageBody;
                ctx.header = header + ctx.header;
                delete page.ctx;
                cb(null);
            })
        },
        function (err) {
            if (err)
                return callback(err);

            var warn = '';
            if (missing.length !== 0)
                warn = ' with error: missing output module(s) '
                + 'for page kind(s): '
                + missing.toString();

            ddd = ddd
                .replace('$PATH', path.basename(jsonFilePath('pages', true)))
                .replace('$DATE', (new Date()).toISOString())
                .replace('$HEADER', ctx.header)
                .replace('$BODY', body);
            writeDDD(ddd, warn, callback);
        }
    );
}


function writeDDD(ddd, warn, callback)
// ----------------------------------------------------------------------------
// Write text to .ddd file and update cached MD5 sum
// ----------------------------------------------------------------------------
// callback(err [, md5sum])
{
    var file = docPath();
    warn = warn || '';
    try
    {
        fs.writeFileSync(file, ddd);
    }
    catch (e)
    {
        return callback('Error writing file');
    }
    verbose(file + ' saved' + warn);
    cached.dddmd5 = crypto.createHash('md5').update(ddd).digest('hex');
    callback(null, cached.dddmd5);
}


app.get(/^\/init\/(.*)$/, function(req, res)
// ----------------------------------------------------------------------------
//   Debug access to loadPageFromTemplate
// ----------------------------------------------------------------------------
{
    var path = __dirname + '/fields';
    var template = req.params[0];
    console.log('init:', template);
    var templateFile = ddtFilePath(template);
    var result = '';
    var page = {};
    if (templateFile)
    {
        fields.beginFields();
        var obj = templates.processTemplatePath(templateFile, template, path);
        obj(page);              // Result of text processing ignored
        result = fields.endFields();
    }
    res.send(result);
});


function loadPageFromTemplate(page, template)
// ----------------------------------------------------------------------------
//   Load page properties from a template
// ----------------------------------------------------------------------------
{
    var path = __dirname + '/fields';
    var templateFile = ddtFilePath(template);
    var result = '';
    if (templateFile)
    {
        fields.beginFields();
        var obj = templates.processTemplatePath(templateFile, template, path);
        obj(page);              // Result of text processing ignored
        result = fields.endFields();
    }
    verbose('Initial value for template ' + template + ' is ' + result);
    return result;
}


function ddtFilePath(themePath)
// ----------------------------------------------------------------------------
//   Return the DDT file given a theme path
// ----------------------------------------------------------------------------
//   We start in the themes directory with the complete theme path,
//   and keep going up until we find it
{
    if (themePath in ddtFileCache)
        return ddtFileCache[themePath];

    var origPath = themePath;
    while (themePath != '')
    {
        var templateFile = __dirname + '/../themes/' + themePath + '.ddt';
        verbose("Looking at " + templateFile + " for " + origPath);
        if (fs.existsSync(templateFile))
        {
            ddtFileCache[origPath] = templateFile;
            return templateFile;
        }
        var repl = themePath.replace(/[^\/]+\/([^\/]+)$/, '$1');
        if (repl == themePath)
            themePath = '';
        else
            themePath = repl;
    }
    return null;
}


function convertToClientSide(pages)
// ----------------------------------------------------------------------------
//   Convert all pages to client side (serialized dynamicfields)
// ----------------------------------------------------------------------------
{
    pages.forEach(function(page) {
        if (page.properties)
        {
            page.dynamicfields = JSON.stringify(page.properties);
            delete page.properties;
        }
    });
}


function convertToServerSide(pages)
// ----------------------------------------------------------------------------
//   Convert all pages to server side (unserialized properties)
// ----------------------------------------------------------------------------
{
    pages.forEach(function(page) {
        if (page.dynamicfields)
        {
            page.properties = JSON.parse(page.dynamicfields);
            delete page.dynamicfields;
        }
    });
}


function stringify(object)
// ----------------------------------------------------------------------------
//   Stringify in verbose or normal mode
// ----------------------------------------------------------------------------
{
    if (VERBOSE)
        return JSON.stringify(object, null, '  ');
    return JSON.stringify(object);
}


function verbose()
// ----------------------------------------------------------------------------
//   Show something only when in VERBOSE mode
// ----------------------------------------------------------------------------
{
    if (VERBOSE)
        console.log.apply(console, arguments);
}
