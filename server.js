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
// /rest/pages       Create one    List all   Not used    Not used 
// /rest/pages/:id   Error         Get one    Update one  Delete one

app.get('/rest/pages', function(req, res) {
    getPages(function(err, pages) {
        res.send(err ? 500 : pages);
    });
});

app.get('/rest/pages/:id', function(req, res) {
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

app.post('/rest/pages', function (req, res) {
    getPages(function(err, pages) {
        var page = req.body;
        page.id = allocatePageId(pages);
        pages.push(page);
        console.log('Page ' + page.id + ' created');
        save(pages);
        var rsp = { success: true, pages: [] };
        rsp.pages[0] = page;
        res.send(rsp);
    });
});

app.put('/rest/pages/:id', function(req, res) {
    getPages(function(err, pages) {
        var found = null;
        for (var i = 0; i < pages.length; i++) {

            if (pages[i].id == req.params.id) {
                found = pages[i] = req.body;
                console.log('Page ' + found.id + ' updated');
                save(pages);
            }
        }
        res.send(found ? found : 404);
    });
});

app.delete('/rest/pages/:id', function(req, res) {
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

app.use(express.static( __dirname + '/www'));


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

function escape(txt)
{
    return txt.replace('"', '""');
}

function writeTaoDocument(pages)
{
    var ddd = '';
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        ddd += 'page "' +  escape(page.name) + '",\n';
        ddd += '    text_box 0, 0, 0.8 * window_width, 0.9 * window_height,\n';
        ddd += '        text "' + escape(page.name) + '"\n'
        ddd += '        line_break\n';
        if (typeof page.title !== 'undefined')
            ddd += '        text "' + escape(page.title) + '"\n';
    }
    var file = __dirname + '/doc.ddd';
    fs.writeFileSync(file, ddd);
}
