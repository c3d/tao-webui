// ****************************************************************************
//  import_theme.js                                               Tao project
// ****************************************************************************
//
//   File Description:
//
//     Emit the import and theme for a given slide theme
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

function emitThemeImport(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the theme and import statements for the current theme
// ----------------------------------------------------------------------------
{
    return util.importHeader(page.ctx, page.ctx.themeShort + 'Theme') +
           util.theme(page.ctx, page.ctx.themeShort);
}

module.exports = emitThemeImport;
