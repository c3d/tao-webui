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

    var out = '';

    function output(txt)
    {
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
                dom.children.forEach(function(elt) {
                    convert(elt);
                });
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
                    output('font_size ' + scale + ' * theme_size(theme, slide_master, "story")\n')
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