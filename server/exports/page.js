// ****************************************************************************
//  page.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     Emit the dynamic elements of a page
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
var fs = require('fs');

function emitPage(page, indent)
// ----------------------------------------------------------------------------
//   Emit the code for the page dynamic elements
// ----------------------------------------------------------------------------
{
    var ddd = '';
    var dynamic = page.dynamicfields;
    if(dynamic && dynamic != '')
    {
        // Decode JSON string
        var items = JSON.parse(dynamic);

        // Loop on all elements in the object and emit them
        for (var item in items)
            page[item] = items[item];
        for (var item in items)
            if (fs.existsSync(__dirname + '/' + item + '.js'))
                ddd += require('./' + item) (page, indent);
    }
    return ddd;
}

module.exports = emitPage;
