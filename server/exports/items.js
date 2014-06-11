// ****************************************************************************
//  items.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     Emit the dynamic elements of an item list
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

function emitItems(page, id, parms)
// ----------------------------------------------------------------------------
//   Emit the code for a body
// ----------------------------------------------------------------------------
{
    console.log('Page=', page);
    console.log('ID=', id);
    console.log('Parms=', parms);

    var ddd = '';
    var items = page.items;
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
    return ddd;
}

module.exports = emitItems;
