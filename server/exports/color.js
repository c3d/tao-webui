// ****************************************************************************
//  color.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given color value
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

function emitColor(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the page
// ----------------------------------------------------------------------------
{
    var color = util.property(page, id, value);
    if (color === null)
        return '';
    if (color.hasOwnProperty("value"))
        color = color.value;
    return '"' + color + '"';
}

module.exports = emitColor;
