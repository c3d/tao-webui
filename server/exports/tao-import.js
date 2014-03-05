// ****************************************************************************
//  tao-import.js                                                  Tao project
// ****************************************************************************
//
//   File Description:
//
//     Process the 'import' statements during export
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


function processImport(context, importName)
// ----------------------------------------------------------------------------
//   Process 'import' statement during export
// ----------------------------------------------------------------------------
{
    var callback = util.importHeader(importName);
    return callback(context);
}


module.exports = processImport;
