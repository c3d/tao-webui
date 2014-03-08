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

function emitText(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the page
// ----------------------------------------------------------------------------
{
    var text = util.property(page, id, value);
    if (text === null)
        return '';
    return util.emitText(text);
}


module.exports = emitText;
