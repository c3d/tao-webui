// ****************************************************************************
//  rich_text.js                                                   Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given rich text, formatted as XL code
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

function emitRichText(page, id, parms)
// ----------------------------------------------------------------------------
//   Emit a rich text
// ----------------------------------------------------------------------------
{
    var text = util.property(page, id, parms);
    if (text === null)
        return parms && parms.label ? 'nil' : '';
    return util.htmlToSlide(text, '');
}


module.exports = emitRichText;
