// ****************************************************************************
//  app.js                                                         Tao project
// ****************************************************************************
//
//   File Description:
//
//     Main application file for Tao Web Editor
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
//  (C) 2014 Taodyne SAS
// ****************************************************************************

Ext.Loader.setPath('Ext.ux.form.field', 'ext-tinymce/ux/form/field');

Ext.application(
{
    name: 'TE',  // 'Tao Editor'
    requires: [
        'TE.i18n.Translate',
        'Ext.container.Viewport'
    ],

    appFolder: 'app',

    init: function()
    {
        var lang = typeof TE_lang !== 'undefined' ? TE_lang : 'en';
        TE.i18n.Translate.lang = lang;
        tr = TE.i18n.Translate.getTr();
        
        if (lang === 'fr')
            TE.i18n.Translate.register(Ext.create('TE.i18n.fr').translations);

        this.controllers = [ 'Editor' ];
    },

    launch: function()
    {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: 'te_editor'
                }
            ]
        });
    }
});
