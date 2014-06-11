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
    var item = util.property(page, id, value);
    if (item === null)
        return '';
    var model = item.model;
    var ddt = model + '.ddt';
    var path = __dirname + '/../fields';
    console.log("Processing model ", model);

    var processor = templates.processTemplateFile(ddt, item.data, path);
    processor(item.data);    
}

module.exports = emitItem;
