// ****************************************************************************
//  title.js                                                       Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Emit the Tao code for a title
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

function emitTitle(page, indent)
// ----------------------------------------------------------------------------
//   Emit the code for the page title
// ----------------------------------------------------------------------------
{
    var ddd = '';
    if (page.title && page.title != '')
        ddd += indent + 'title\n'
             + util.htmlToSlide(page.title, indent + util.indentString);
    else
        ddd += indent + 'title text page_label\n';
    return ddd;
}

module.exports = emitTitle;
