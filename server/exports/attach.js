// ****************************************************************************
//  attach.js                                                      Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Process an attachment during export
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

var util = require('../util');
var fs = require('fs');
var http = require('http');
var path = require('path');

function emitAttachment(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the page
// ----------------------------------------------------------------------------
{
    var name = value.label;
    var ctx = page.ctx;
    var verbose = page.ctx.verbose;
    var file = path.resolve(path.dirname(ctx.docPath), name);
    var key = "FILE:" + file;
    if (!ctx.hasOwnProperty(key))
    {
        var asset = path.dirname(ctx.themePath) + "/" + name;
        var is = ctx.themeAsset(asset);
        verbose("Reading asset from " + asset);

        // Create asset directory if necessary
        var dir = path.dirname(file);
        if (!fs.existsSync(dir))
            fs.mkdirParent(dir);

        verbose("Writing file: ", file);
        var os = fs.createWriteStream(file);
        is.pipe(os);

        is.on('end',function() {
            verbose("Attach: Copied file ", file);
        });
        is.on('error',function(err) {
            verbose("Attach: Read error ", err);
        });
        os.on('error', function(err) {
            verbose("Attach: Write error: ", err);
        });

        ctx[key] = true;
    }
    return "";
}


module.exports = emitAttachment;
