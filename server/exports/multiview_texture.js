// ****************************************************************************
//  multiview_texture.js                                          Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given multiview texture name
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

function emitMultiviewTexture(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the multiview texture
// ----------------------------------------------------------------------------
{
    var text = util.property(page, id, value);
    if (text === null)
        return '';
    return util.emitText(text);
}


module.exports = emitMultiviewTexture;
