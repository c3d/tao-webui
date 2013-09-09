var express = require('express');
var app = express();
var fs = require('fs');

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

app.get('/pages', function(req, res) {
    getPages(function(err, pages) {
        res.send(err ? 500 : pages);
    });
});

app.get('/pages/:id', function(req, res) {
    getPages(function(err, pages) {
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
    getPages(function(err, pages) {
        var page = req.body;
        page.id = allocatePageId(pages);

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
    getPages(function(err, pages) {
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
            console.log('Page moved from index ' + i + ' to index ' + found.idx);
            // - no need to keep the idx attribute in the page
            delete found.idx;
        }
        if (found)
            save(pages);
        res.send(found ? found : 404);
    });
});

app.delete('/pages/:id', function(req, res) {
    getPages(function(err, pages) {
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


// Serve static files

app.use(express.static( __dirname + '/../www'));


// Start server

var PORT = process.env.PORT || 3000;
app.listen(PORT, null, function() {
    console.log('Server listening on port ' + PORT);
});


// Helpers

var cached_pages = null;
function getPages(callback)
{
    if (cached_pages !== null) {
        callback(null, cached_pages);
    } else {
        var file = __dirname + '/data/pages.json';
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log('File read error: ' + err);
                callback(err);
            } else {
                if (data.trim().length === 0)
                    data = '[]';
                cached_pages = JSON.parse(data);
                callback(null, cached_pages);
            }
        });
    }
}

function save(pages)
{
    fs.writeFileSync(__dirname + '/data/saved_pages.json', JSON.stringify(pages));
    writeTaoDocument(pages);
}

function allocatePageId(pages)
{
    var ids = {};
    pages.forEach(function(page) {
        ids[page.id] = 1;
    });
    var id = 1;
    while (id in ids)
        id++;
    return id;
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
