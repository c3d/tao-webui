var htmlparser = require('htmlparser');
var util = require('util');
var ent = require('ent');


// Repeat double quotes so that result may be used in Tao double-quoted string
function escape(txt)
{
    return txt.replace(/"/g, '""');
}

// Make HTML encoded text useable as a Tao text string
function decodeHtml(txt)
{
    return escape(ent.decode(txt));
}

var DomToSlideConverter = (function(nindent) {

    var indentString = '    ';
    var lineStart = true;
    var listMode = ''; // '', 'ul', 'ol'
    var prev = ''; // previous line

    var out = '';

    function output(txt)
    {
        // Multiple occurrences of some commands are useless
        if (txt.trim() === 'paragraph_break' && prev === txt.trim())
            return;

        prev = txt.trim();
        if (lineStart)
            doIndent();
        out += txt;
        lineStart = (txt.slice(-1) === '\n') ? true : false;
    }

    function doIndent()
    {
        for (var i = 0; i < nindent; i++)
            out += indentString;
    }

    function indent()
    {
        nindent++;
    }

    function unindent()
    {
        nindent--;
    }

    function clear()
    {
        out = '';
        lineStart = true;
        nindent = 1;
    }

    // Output Tao code for 'style' attribute
    function convertStyle(style, revert)
    {
        revert = (typeof revert !== 'undefined') ? revert : false;

        var styles = style.match(/[^;]+/g); // split at ;, leave out empty elements
        styles.forEach(function(s) {
            var col = s.indexOf(':');
            var name = s.substring(0, col).trim();
            var value = s.substring(col + 1).trim();
            switch (name)
            {
            case 'text-align':
                if (value === 'left' || value === 'center' || value === 'right')
                {
                    if (revert)
                    {
                        output('paragraph_break\n');
                        value = 'left';
                    }
                    output('align_' + value + '\n');
                }
                else
                {
                    console.log('Unsupported text-align value: ' + value);
                }
                break;
            case 'color':
                // Ignored because text color overrides are not set by
                // <div style: 'color: rgb(x,y,z);'>
                // but by <font color="#abcdef"> which is handled elsewhere.
                // And, <div style: 'color: rgb(0,0,0);'> is used to restore
                // the default color, which is done automatically by text_span.
                break;
            default:
                console.log('Style element ignored: ' + name + ': ' + value);
            }
        })

    }

    // Make sure all font names in comma-separated list are quoted with '' or ""
    // Quote names that are not quoted (with "")
    // Discard font names starting and ending with underscore (_)
    // to handle special font names: '_default font_' or '_defaut_'
    // (see app/util/CustomHtmlEditor.js)
    //
    // Example:
    //   (input)  >'foo', "bar", baz, _def_<
    //   (return) >'foo', "bar", "baz"<
    function checkFontFaces(faces)
    {
        var processed = [];
        var tab = faces.split(',');
        for (var i = 0; i < tab.length; i++)
        {
            var face = tab[i].trim();
            if (face[0] === "_" && face[face.length - 1] === "_")
                continue;
            if (face[0] !== "'" && face[0] !== '"')
                face = '"' + face + '"';
            processed.push(face);
        }

        return processed.length > 0 ? processed.join() : undefined;
    }

    function convert(dom)
    {
        if (dom === null)
            return out;

        if (Array.isArray(dom))
        {
            dom.forEach(function(elt) {
                convert(elt);
            });
            return out;
        }

        switch (dom.type)
        {
        case 'text':
            output('text "' + decodeHtml(dom.data) + '"\n');
            break;
        case 'tag':
            switch(dom.name)
            {
            case 'p':
                output('paragraph_break\n');
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                break;
            case 'div':
                output('paragraph_break\n');
                if (dom.attribs && dom.attribs.style)
                    convertStyle(dom.attribs.style);
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                if (dom.attribs && dom.attribs.style)
                {
                    output('paragraph_break\n');
                    convertStyle(dom.attribs.style, true);
                }
                break;
            case 'span':
                if (dom.attribs)
                {
                    output('text_span\n');
                    indent();
                }
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                if (dom.attribs)
                    unindent();
                break;
            case 'u':
                output('underline\n');
                indent();
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                unindent();
                break;
            case 'br':
                if (/line_break$/.test(prev))
                    output('text " "; line_break\n');
                else
                    output('line_break\n');
                break;
            case 'b':
                output('bold\n');
                indent();
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                unindent();
                break;
            case 'i':
                output('italic\n');
                indent();
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                unindent();
                break;
            case 'ul':
                listMode = 'ul';
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                break;
            case 'ol':
                listMode = 'ol';
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                break;
            case 'li':
                if (dom.attribs && dom.attribs.style)
                    convertStyle(dom.attribs.style);
                switch (listMode)
                {
                case 'ul':
                    output('* ""\n');
                    dom.children.forEach(function(elt) {
                        convert(elt);
                    });
                    break;
                case 'ol':
                    output('+ ""\n');
                    dom.children.forEach(function(elt) {
                        convert(elt);
                    });
                    break;
                default:
                    console.log('<li> outside of <ul>/<ul>');
                }
                if (dom.attribs && dom.attribs.style)
                    convertStyle(dom.attribs.style, true);
                break;
            case 'font':
                var faces = (dom.attribs && dom.attribs.face) ? checkFontFaces(dom.attribs.face) : undefined;
                var hasAttr = (dom.attribs && (faces || dom.attribs.color || dom.attribs.size));
                if (hasAttr)
                {
                    output('text_span\n');
                    indent();
                }
                if (faces)
                {
                    output('font ' + faces + '\n');
                }
                if (dom.attribs && dom.attribs.color)
                {
                    output('color "#' + dom.attribs.color + '"\n');
                }
                if (dom.attribs && dom.attribs.size)
                {
                    var scale = 1 + 0.36 * (Number(dom.attribs.size) - 2);
                    if (scale != 1)
                        output('font_size ' + scale + ' * theme_size(theme, slide_master, "story")\n');
                }
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                if (hasAttr)
                    unindent();
                break;
            default:
                console.log('Unrecognized tag: ' + dom.name);
            }
            break;
        default:
            console.log('Unrecognized type: ' + dom.type);
        }

        return out;
    }

    return {
        convert: convert,
        clear: clear
    }
});

// Convert HTML code produced by Ext.form.field.HtmlEditor to a block code
// suitable for use in Tao slides.
// baseIndent is the level of indentation to use when starting the new block
// (positive integer). Defaults to 1.
function htmlToSlideContent(html, baseIndent)
{
    baseIndent = typeof baseIndent !== 'undefined' ? baseIndent : 1;

    // \n sometimes appear in the source html between html elements. They should
    // be discarder because:
    // (1) They are not meaningful (the html editor uses <div>'s for paragraph
    // breaks and <br> for line breaks),
    // (2) Carriage returns cannot be inserted in the text strings due to the
    // Tao syntax we use: text "..."
    html = html.replace(/\n/g, '');
    var handler = new htmlparser.DefaultHandler(function(error, dom) {
        if (error)
        {
            console.error('HTML parse error');
            dom = null;
            return;
        }
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    //console.log(util.inspect(handler.dom, { depth:null }));
    var res = DomToSlideConverter(baseIndent).convert(handler.dom);
    //console.log('RES =\n' + res);
    return res;
}

module.exports = {
    escape: escape,
    htmlToSlideContent: htmlToSlideContent
}