// ****************************************************************************
//  real.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given real value
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

function emitReal(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the page
// ----------------------------------------------------------------------------
{
    var number = util.property(page, id, value);
    if (number === null)
        return '';
    if (number.hasOwnProperty("value"))
        number = number.value;
    return parseFloat(number);
}

module.exports = emitReal;
