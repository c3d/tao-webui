// ****************************************************************************
//  integer.js                                                     Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given integer value
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

function emitInteger(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the page
// ----------------------------------------------------------------------------
{
    var number = util.property(page, id, value);
    if (number === null)
        return '';
    return parseInt(number.value);
}


module.exports = emitInteger;
