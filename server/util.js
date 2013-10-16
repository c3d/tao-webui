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
    var listState = []; // array of list types ('ul' or 'ol'), innermost at end
    var prev = ''; // previous line

    var out = '';

    function startList(type)
    {
        listState.push(type);
    }

    function endList()
    {
        listState.pop();
    }

    // Return the string to be used in Tao for the current level of unordered/ordered list
    function currentListSymbol()
    {
        if (listState.length === 0)
            return '';
        var symbols = {
            'ul': [ '*', '**', '***' ],
            'ol': [ '+', '++', '+++' ],
            'X':  [ '=', '--', '---' ]
        };
        return symbols[listState[listState.length-1]][Math.min(listState.length-1, 2)];
    }

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

    function outputAlign(value)
    {
        switch (value) {
            case 'left':
            case 'center':
            case 'right':
            case 'justify':
                output('align_' + value + '\n');
                break;
            default:
                console.log('Unsupported text-align value: ' + value);
        }
    }

    function outputTextDecoration(value)
    {
        if (value === 'underline')
            output('underline\n');
        else if (value === 'line-through')
            output('strikeout\n');
        else
            console.log('Unsupported text-decoration value: ' + value);
    }

    function outputFontFamily(value)
    {
        var descr = toTaoFontList(value);
        if (descr.length)
            output('font ' +  descr + '\n');
    }

    function outputFontSize(value)
    {
        var sz = 0;
        switch (value) {
            case 'xx-small':  sz = -2; break;
            case 'x-small':   sz = -1; break;
            case 'small':              break;
            case 'medium':    sz =  1; break;
            case 'large':     sz =  2; break;
            case 'x-large':   sz =  3; break;
            case 'xx-large':  sz =  4; break;
            default:
                console.log('Unsupported font_size value: ' + value);
                return;
        }
        var scale = 1 + 0.3 * sz;
        if (scale != 1)
            output('font_size ' + scale + ' * theme_size(theme, slide_master, "story")\n');
    }

    function outputColor(value)
    {
        output('color "' + value + '"\n');
    }

    // Output Tao code for 'style' attribute
    function convertStyle(style)
    {
        var styles = style.match(/[^;]+/g); // split at ; leave out empty elements
        styles.forEach(function(s) {
            var col = s.indexOf(':');
            var name = s.substring(0, col).trim();
            var value = s.substring(col + 1).trim();
            switch (name)
            {
            case 'text-align':
                outputAlign(value);
                break;
            case 'text-decoration':
                outputTextDecoration(value);
                break;
            case 'font-family':
                outputFontFamily(value);
                break;
            case 'font-size':
                outputFontSize(value);
                break;
            case 'color':
                outputColor(value);
                break;
            default:
                console.log('Unsupported style element: ' + name + ': ' + value);
            }
        })
    }

    // Make sure all font names in comma-separated list are quoted with ""
    // Discard font names following a name starting and ending with underscore (_)
    // to handle special font names: '_default font_' or '_defaut_'
    // (see app/util/CustomHtmlEditor.js)
    // May return an empty string.
    //
    // Example:
    //   (input)  >'foo', "bar", baz, _def_, glop<
    //   (return) >"foo", "bar", "baz"<
    function toTaoFontList(faces)
    {
        var processed = [];
        var tab = faces.split(',');
        for (var i = 0; i < tab.length; i++)
        {
            var face = tab[i].trim();
            face = face.replace(/^\"|\"$|^\'|\'$/g, '');
            if (face[0] === "_" && face[face.length - 1] === "_")
                break;
            face = '"' + face + '"';
            processed.push(face);
        }

        return processed.length > 0 ? processed.join() : '';
    }

    function convertAttribs(dom)
    {
        var attribs = dom.attribs || [];
        for (attr in attribs) {
            var value = attribs[attr];
            switch (attr)
            {
            case 'align':
                outputAlign(value)
                break;
            case 'style':
                convertStyle(value);
                break;
            default:
                console.log('Attribute ignored: ' + attr + ': ' + value);
            }
        }
    }

    function convertChildren(dom)
    {
        if (dom.children)
        {
            dom.children.forEach(function(elt) {
                convert(elt);
            });
        }
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
                output('paragraph\n');
                indent();
                convertAttribs(dom);
                convertChildren(dom);
                unindent();
                break;
            case 'span':
                output('text_span\n');
                indent();
                convertAttribs(dom);
                convertChildren(dom);
                unindent();
                break;
            case 'br':
                if (/line_break$/.test(prev))
                    output('text " "; line_break\n');
                else
                    output('line_break\n');
                break;
            case 'strong':
                output('bold\n');
                indent();
                convertChildren(dom);
                unindent();
                break;
            case 'em':
                output('italic\n');
                indent();
                convertChildren(dom);
                unindent();
                break;
            case 'ul':
                startList('ul');
                convertChildren(dom);
                endList();
                break;
            case 'ol':
                startList('ol');
                convertChildren(dom);
                endList();
                break;
            case 'li':
                if (dom.attribs && dom.attribs.style)
                    convertStyle(dom.attribs.style);
                output(currentListSymbol() + '\n')
                indent();
                convertChildren(dom);
                unindent();
                if (dom.attribs && dom.attribs.style)
                    convertStyle(dom.attribs.style, true);
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