// ****************************************************************************
//  item.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     Export a single item
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
//  (C) 2014 Jérôme Forissier <jerome@taodyne.com>
//  (C) 2014 Catherine Burvelle <cathy@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

var util = require('../util');
var templates = require('../templates');


function emitItem(items, id, parms)
// ----------------------------------------------------------------------------
//   Emit the contents of the page
// ----------------------------------------------------------------------------
{
    var item = items.properties[id];
    if (item === null)
        return '';

    var model = item._model_;
    var path = __dirname;
    var ctx = items.ctx;
    var ddtFilePath = ctx.ddtFilePath;
    var ddt = ddtFilePath(model);
    if (ddt)
    {
        var processor = templates.processTemplatePath(ddt, model, path);
        
        var dataItem = { model: model, properties: item, ctx: ctx };
        var result = processor(dataItem);
        return result;
    }

    return '';
}

module.exports = emitItem;
