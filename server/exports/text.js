// ****************************************************************************
//  text.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given text
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

function emitText(page, indent, id)
// ----------------------------------------------------------------------------
//   Emit the name of the page
// ----------------------------------------------------------------------------
{
    if (id)
    {
        var text = page.properties[id];
        if (!text)
            text = '';
        
        if (text.indexOf('\n') >= 0)
            return indent + '<<' + text + '>>';
        return indent + '"' + text + '"';
    }
    return '';
}


module.exports = emitText;
