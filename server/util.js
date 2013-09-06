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

var DomToSlideConverter = (function() {

    var nindent = 1;
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

        if (lineStart)
            indent();
        out += txt;
        lineStart = (txt.slice(-1) === '\n') ? true : false;
    }

    function indent()
    {
        for (var i = 0; i < nindent; i++)
            out += indentString;
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
                    // TODO handle dom.attribs.style e.g., span style="font-family: 'courier new'; font-size: small;"
                    nindent++;
                }
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                if (dom.attribs)
                    nindent--;
                break;
            case 'u':
                output('text_span\n');
                nindent++;
                output('underline 1\n');
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                nindent--;
                break;
            case 'br':
                output('line_break\n');
                break;
            case 'b':
                output('text_span\n');
                nindent++;
                output('bold\n');
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                nindent--;
                break;
            case 'i':
                output('text_span\n');
                nindent++;
                output('italic\n');
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                nindent--;
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
                    console.log('<li> outside of <ul>/<ol>');
                }
                if (dom.attribs && dom.attribs.style)
                    convertStyle(dom.attribs.style, true);
                break;
            case 'font':
                var hasAttr = (dom.attribs && (dom.attribs.face || dom.attribs.color || dom.attribs.size));
                if (hasAttr)
                {
                    output('text_span\n');
                    nindent++;
                }
                if (dom.attribs && dom.attribs.face)
                {
                    var faces = dom.attribs.face.replace(/, /g, '", "');
                    output('font "' + faces + '"\n');
                }
                if (dom.attribs && dom.attribs.color)
                {
                    output('color "' + dom.attribs.color + '"\n');
                }
                if (dom.attribs && dom.attribs.size)
                {
                    var scale = 1 + 0.2 * (Number(dom.attribs.size) - 2);
                    if (scale != 1)
                        output('font_size ' + scale + ' * theme_size(theme, slide_master, "story")\n');
                }
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
                if (hasAttr)
                    nindent--;
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

// Convert HTML code produced by Ext.form.field.HtmlEditor to Tao code suitable
// for use as the body of a "slide" command.
function htmlToSlideContent(html)
{
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
    var res = DomToSlideConverter().convert(handler.dom);
    //console.log('RES =\n' + res);
    return res;
}

module.exports = {
    escape: escape,
    htmlToSlideContent: htmlToSlideContent
}