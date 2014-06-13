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
//   Don't emit anything for 'items', we emit it for 'item'
// ----------------------------------------------------------------------------
{
    var items = util.page_property(page, id, parms);
    if (items === null)
        return '';

    var ddd = '';
    if(items && items != '')
    {
        // Loop on all elements in the object and emit them
        var childPage = { properties: items, ctx: page.ctx }
        for (var item in items)
        {
            var kind = item.replace(/_[0-9]+/, '');
            if (fs.existsSync(__dirname + '/' + kind + '.js'))
                ddd += require('./' + kind) (childPage, item, { pageId: item });
        }
        delete items.ctx;
    }

    return ddd;
}

module.exports = emitItems;
