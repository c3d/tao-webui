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

function emitPage(page, id, parms)
// ----------------------------------------------------------------------------
//   Emit the code for the page dynamic elements
// ----------------------------------------------------------------------------
{
    var ddd = '';
    var items = page.properties;
    if(items && items != '')
    {
        // Loop on all elements in the object and emit them
        for (var item in items)
        {
            var kind = item.replace(/_[0-9]+/, '');
            if (fs.existsSync(__dirname + '/' + kind + '.js'))
                ddd += require('./' + kind) (page, item, { pageId: item });
        }
    }
    if (ddd == '')
        ddd = 'nil';
    return ddd;
}

module.exports = emitPage;
