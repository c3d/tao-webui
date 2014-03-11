// ****************************************************************************
//  templates.js                                                   Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Process .DDT files (dynamic document templates)
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

var ejs = require('ejs');
var util = require('./util');
var fs = require('fs');

// Regular expressions for elements in a template
var importRe = /import\s+(\w+).*\n/g;
var themeRe = /theme\s+(".*")/g;
var indentedValRe = /^(\s*)\[\[\s*(\w+)\s*(\{[^\]]*\})\s*\]\]/gm;
var templateValRe = /\[\[\s*(\w+)\s*(\{[^\]]*\})\s*\]\]/g;
var indentedLblRe = /^(\s*)\[\[\s*(\w+)\s*(\"[^\]]*\")\s*\]\]/gm;
var templateLblRe = /\[\[\s*(\w+)\s*(\"[^\]]*\")\s*\]\]/g;
var indentedRe = /^(\s*)\[\[\s*(\w+)\s*\]\]/gm;
var templateRe = /\[\[\s*(\w+)\s*\]\]/g;


function processTemplate(template, themePath, importCB, themeCB, primitiveCB)
// ----------------------------------------------------------------------------
//    Load a .DDT file and process it using EJS
// ----------------------------------------------------------------------------
//  importCB:
//    The import callback, called for 'import' statements in the template
//    Signature: importCB(context, importName), returns import.
//
//  themeCB:
//    The theme callback, called for all 'theme' statements in the template
//    Signature: themeCB(context, themeName)
//
//  primitiveCB:
//    The primitive callback, called for [[primitive]] notations in template.
//    Signature: primitiveCB(page, name, indent)
{
    // Fetch data from the file
    var data = fs.readFileSync(template, 'utf8');
    var dataMtime = fs.statSync(template).mtime;
    
    function updateDataIfNeeded()
    // ------------------------------------------------------------------------
    //    Re-load template file if it changed
    // ------------------------------------------------------------------------
    {
        if (fs.statSync(template).mtime > dataMtime)
        {
            data = fs.readFileSync(template, 'utf8');
            dataMtime = fs.statSync(template).mtime;
        }
    }


    return function(page)
    // ------------------------------------------------------------------------
    //  A function that generates the .DDD file from the template
    // ------------------------------------------------------------------------
    {
        // Reload data if it changed
        updateDataIfNeeded();

        // Save template path name and short name
        var ctx = page.ctx;
        if (ctx)
        {
            var re = /(.*\/)*([^\/]+)\/[^\/]+$/;
            ctx.themePath = themePath;
            ctx.themeName = themePath.replace(re,'$2');
            ctx.themeShort = ctx.themeName.replace(/ /g, '')
        }

        // Build execution context for EJS
        var options =
            {
                locals:
                {
                    page: page,
                    ctx: ctx,
                    run: primitiveCB,
                    theme: themeCB,
                    importHeader: importCB
                },
                filename: template,
                cached: false,
                scope: this,
                open: "[[",
                close: "]]"
            };

        var noImports = data
            .replace(importRe, '[[- importHeader(ctx, "$1") ]]')
            .replace(themeRe, '[[- theme(ctx, $1) ]]')
            .replace(indentedLblRe, '[[- run(page, "$2", "$1", {label:$3}) ]]')
            .replace(templateLblRe, '[[- run(page, "$1", "", {label:$2}) ]]')
            .replace(indentedValRe, '[[- run(page, "$2", "$1", $3) ]]')
            .replace(templateValRe, '[[- run(page, "$1", "", $2) ]]')
            .replace(indentedRe, '[[- run(page, "$2", "$1") ]]')
            .replace(templateRe, '[[- run(page, "$1", "") ]]');
        var result = ejs.render(noImports, options);
        return result;
    }
}


function processTemplatePath(template, themePath, path)
// ----------------------------------------------------------------------------
//   Process template with modules 
// ----------------------------------------------------------------------------
{
    var importCB = require(path + '/tao-import');
    var themeCB = require(path + '/tao-theme');

    function primitiveCB(page, name, indent, parms)
    {
        var kind = name.replace(/_[0-9]+/, '');
        var modpath = path + '/' + kind;
        var file = modpath + '.js';
        if (!fs.existsSync(file))
        {
            console.log("UNIMPLEMENTED PRIMITIVE: " + file);
            return '';
        }
        else
        {
            var module = require(modpath);
            var code = module(page, name, parms);
            if (indent != '')
                code = util.indent(code, indent);
            return code;
        }
    }

    return processTemplate(template, themePath, importCB,themeCB,primitiveCB);
}


module.exports =
{
    processTemplate:      processTemplate,
    processTemplatePath:  processTemplatePath
}
