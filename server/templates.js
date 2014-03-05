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
var indentedRe = /^(\s*)\[\[\s*(\w+)\s*\]\]/gm;
var templateRe = /\[\[\s*(\w+)\s*\]\]/g;


function processTemplate(template, importCB, themeCB, primitiveCB)
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
            verbose ('Reloading ' + template);
            data = fs.readFileSync(template, 'utf8');
            dataMtime = fs.statSync(template).mtime;
        }
    }


    return {
        header: function(context)
        // --------------------------------------------------------------------
        //   A function that returns the imports
        // --------------------------------------------------------------------
        {
            // Reload data in case it changed
            updateDataIfNeeded();
            
            var imports = data.match(importRe);
            var result = '';
            if (imports)
            {
                imports.forEach(function(imp) {
                    var impName = imp.replace(importRe, '$1');
                    result += importCB(context, impName);
                });
            }
            return result;
        },

        generate: function(page)
        // --------------------------------------------------------------------
        //  A function that generates the .DDD file from the template
        // --------------------------------------------------------------------
        {
            // Reload data if it changed
            updateDataIfNeeded();

            // Build execution context for EJS
            var options =
            {
                locals:
                {
                    page: page,
                    ctx: page.ctx,
                    escape: util.escape,
                    html: util.htmlToSlide,
                    run: primitiveCB,
                    theme: themeCB
                },
                filename: template,
                cached: false,
                scope: this,
                open: "[[",
                close: "]]"
            };

            var noImports = data
                .replace(importRe, '')
                .replace(themeRe, '[[- theme(ctx, $1) ]]')
                .replace(indentedRe, '[[- run(page, "$2", "$1") ]]')
                .replace(templateRe, '[[- run(page, "$1", "") ]]');
            var result = ejs.render(noImports, options);
            return result;
        }
    }
}


function processTemplatePath(template, path)
// ----------------------------------------------------------------------------
//   Process template with modules 
// ----------------------------------------------------------------------------
{
    var importCB = require(path + '/tao-import');
    var themeCB = require(path + '/tao-theme');

    function primitiveCB(page, name, indent)
    {
        var modpath = path + '/' + name;
        var file = modpath + '.js';
        if (!fs.existsSync(file))
            console.log("UNIMPLEMENTED PRIMITIVE: " + file);
        var module = require(modpath);
        return module(page, indent);
    }

    return processTemplate(template, importCB, themeCB, primitiveCB);
}


module.exports =
{
    processTemplate:      processTemplate,
    processTemplatePath:  processTemplatePath
}
