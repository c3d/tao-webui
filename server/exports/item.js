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


function emitItem(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the page
// ----------------------------------------------------------------------------
{
    var item = util.page_property(page, id, value);
    if (item === null)
        return '';

    var model = item.model;
    var path = __dirname;
    var ctx = page.ctx;
    var ddtFilePath = ctx.ddtFilePath;
    var ddt = ddtFilePath(model);
    var processor = templates.processTemplatePath(ddt, model, path);

    var dataItem = { model: model, properties: item, ctx: ctx };
    if (page.properties.hasOwnProperty('_labels_'))
        dataItem.properties._labels_ = page.properties._labels_;
    var result = processor(dataItem);
    delete dataItem.properties._labels_;
    return result;
}

module.exports = emitItem;
