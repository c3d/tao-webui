// ****************************************************************************
//  util.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     Basic utilities for text manipulations
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

var htmlparser = require('htmlparser');
var util = require('util');
var ent = require('ent');

var indentString = '    ';


function property(page, id, parms)
// ----------------------------------------------------------------------------
//   Find a property in the page that should not be emitted in [[page]]
// ----------------------------------------------------------------------------
//   For example, if you have a field like [[rich_text "Toto"]], it should
//   not be emitted in the part that says [[page]] if there is one.
//   When called from 'page', parms is null, so we don't emit.
//   When called directly from template.js, parms is set and gives label
{
    if (parms && parms.label)
    {
        // Try to find it by label if the label is set
        var label = parms.label;
        var labels = page.properties._labels_;
        for (lbl in labels)
            if (labels[lbl] == label)
                return page.properties[lbl];
    }

    // Called directly from [[page]], which does not have parms set
    return null;
}


function page_property(page, id, parms)
// ----------------------------------------------------------------------------
//   Find a property in the page that should be emitted in [[page]]
// ----------------------------------------------------------------------------
//   For example, if you have a field like [[movie "Label"]], it should not
//   be emitted as part of the page, but if there is a field like [[movie]],
//   then it should be emitted as part of the [[page]] tag (and only there)
{
    // Check if called from 'page'
    if (parms && parms.pageId)
        return page.properties[parms.pageId];

    // Checked if called with a label
    return property(page, id, parms);
}


function escape(txt)
// ----------------------------------------------------------------------------
// Repeat double quotes so that result may be used in Tao double-quoted string
// ----------------------------------------------------------------------------
{
    return txt.replace('"', '""').replace('\n', ' ');
}


function emitText(text)
// ----------------------------------------------------------------------------
//  Emit an XL text with the proper quotes
// ----------------------------------------------------------------------------
{
    if (text.indexOf('\n') >= 0)
    {
        text = text.replace(/>>/, '>> & ">>" & <<');
        return '<<' + text + '>>';
    }
    return '"' + text.replace('"', '""') + '"';
}


function decodeHTML(txt)
// ----------------------------------------------------------------------------
// Make HTML encoded text useable as a Tao text string
// ----------------------------------------------------------------------------
{
    return escape(ent.decode(txt));
}


function filter(json, filter)
// ----------------------------------------------------------------------------
//   Filter JSON object according to a filter
// ----------------------------------------------------------------------------
{
    var results = [];
    for(var property in json)
    {
        if (json.hasOwnProperty(property))
            if (property.match(filter))
                results.push(json[property]);
    }
    return results;
}


function item(json, filter)
// ----------------------------------------------------------------------------
//   Filter JSON object according to a filter, get a single item
// ----------------------------------------------------------------------------
{
    if (json.hasOwnProperty(filter))
        return json[filter];
    for(var property in json)
        if (json.hasOwnProperty(property))
            if (property.match(filter))
                return json[property];
    return null;
}


function htmlToSlide(html, baseIndent)
// ----------------------------------------------------------------------------
//    Convert HTML code to Tao slide code
// ----------------------------------------------------------------------------
// We focus on HTML code produced by Ext.form.field.HtmlEditor, and generate
// code suitable for use by the 'Slides' module of Tao.
// baseIndent is the level of indentation to use when starting the new block,
// a positive integer that defaults to 1.
{
    var kind = typeof baseIndent;
    baseIndent =
          kind === 'string'
        ? baseIndent
        : kind === 'number'
        ? indentString.repeat(baseIndent)
        : '';

    // \n sometimes appear in the source html between html elements. They should
    // be discarder because:
    // (1) They are not meaningful between html elements,
    // (2) They never appear in the text (<br> is used instead)
    // (3) Carriage returns cannot be inserted in the text strings due to the
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
    var res = DomToSlideConverter(baseIndent).convert(handler.dom);
    return res;
}


function theme(ctx, Theme)
// ----------------------------------------------------------------------------
//  Emit a theme change if we did not use the same theme before
// ----------------------------------------------------------------------------
{
    if (Theme == ctx.currentTheme)
        return ''
    ctx.currentTheme = Theme;
    return 'theme "' + Theme + '"\n';
}


function importHeader(ctx, Name)
// ----------------------------------------------------------------------------
//   Return a function that imports the given name only once
// ----------------------------------------------------------------------------
{
    if (!ctx.hasOwnProperty(Name))
    {
        ctx[Name] = 1;
        ctx.header += 'import ' + Name + '\n';
    }
    return '';
}


function emitSlideElement(name)
// ----------------------------------------------------------------------------
//   Return a function emitting a given page element
// ----------------------------------------------------------------------------
{
    return function(page, id, parms)
    {
        var ddd = '';
        var elem = page_property(page, id, parms);
        if (elem)
            ddd = name + '\n' + htmlToSlide(elem, indentString);
        return ddd;
    }
}


function indent(code, before)
// ----------------------------------------------------------------------------
//    Indent the given code with the given spacing
// ----------------------------------------------------------------------------
{
    var array = code.split('\n');
    array.forEach(function(line, index) {
        array[index] = before + line;
    });
    return array.join('\n');
}


// ============================================================================
// 
//    DOM to Slide converter
// 
// ============================================================================

function DomToSlideConverter(baseIndent)
// ----------------------------------------------------------------------------
//    Convert a DOM to Tao slide syntax
// ----------------------------------------------------------------------------
{
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

    // Return the string to be used in Tao for the current level of
    // unordered or ordered list
    function currentListSymbol()
    {
        if (listState.length === 0)
            return '';
        var symbols = {
            'ul': [ '*', '**', '***' ],
            'ol': [ '+', '++', '+++' ]
        };
        var last = listState.length-1;
        return symbols[listState[last]][Math.min(last, 2)];
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
        out += baseIndent;
    }

    function indent()
    {
        baseIndent += indentString;
    }

    function unindent()
    {
        baseIndent = baseIndent.replace(indentString, '');
    }

    function clear()
    {
        out = '';
        lineStart = true;
        baseIndent = '';
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
        var scale = 1;
        var re = /^(\d+(\.\d+)?)pt$/g;
        var pt = re.exec(value);
        if (pt)
        {
            scale = pt[1];
        }
        else
        {
            // Normally we don't receive these font sizes because
            // we have configured the HTML editor to output pt sizes
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
            scale = (1 + 0.3 * sz) * 14.0;
        }
        if (scale != 14)
            output('theme_font_size theme, slide_master, "story", '
                   + scale + '/14.0\n');
    }

    function outputColor(value)
    {
        output('color "' + value + '"\n');
    }

    function outputPaddingLeft(value)
    {
        var re = /^(\d+)px$/g;
        var rpx = re.exec(value);
        if (!rpx) {
            console.log('Unsupported padding-left value: ' + value);
            return;
        }
        var px = rpx[1];
        if (px < 30) {
            // Nothing
        } else if (px < 60) {
            output('- ""\n');
        } else if (px < 90) {
            output('-- ""\n')
        } else {
            output('--- ""\n');
        }
    }

    // Output Tao code for 'style' attribute
    function convertStyle(style)
    {
        // Split at ; leave out empty elements
        var styles = style.match(/[^;]+/g);
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
            case 'padding-left':
                outputPaddingLeft(value);
                break;
            default:
                console.log('Unsupported style element: '+name+': '+value);
            }
        })
    }

    // Make sure all font names in comma-separated list are quoted with ""
    // Discard font names following a name starting and ending with
    // underscore (_) to handle special font names:
    // '_default font_' or '_defaut_'
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

    function generateList(dom)
    {
        if (dom.attribs && dom.attribs.style)
            convertStyle(dom.attribs.style);
        if (dom.children &&
            dom.children.length == 1 &&
            dom.children[0].type == 'text')
        {
            output(currentListSymbol() +
                   ' "' + decodeHTML(dom.children[0].data) + '"\n')
        }
        else
        {
            output(currentListSymbol() + '\n')
            indent();
            convertChildren(dom);
            unindent();
        }
        if (dom.attribs && dom.attribs.style)
            convertStyle(dom.attribs.style, true);
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
            output('text "' + decodeHTML(dom.data) + '"\n');
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
                generateList(dom)
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
}


module.exports =
{
    property: property,
    page_property: page_property,
    escape: escape,
    emitText: emitText,
    decodeHTML: decodeHTML,
    filter: filter,
    item: item,
    htmlToSlide: htmlToSlide,
    emitSlideElement: emitSlideElement,
    theme: theme,
    importHeader: importHeader,
    indent: indent,
    indentString: indentString
}
