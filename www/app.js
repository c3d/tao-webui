//var TE_lang = 'fr';
var tr = function(txt) { throw 'tr() not set (should not happen)'; }

Ext.Loader.setPath('Ext.ux.form.field', 'ext-tinymce/ux/form/field');

Ext.application(
{
    name: 'TE',  // 'Tao Editor'
    requires: [
        'Ext.container.Viewport',
        'TE.i18n.Translate'
    ],

    appFolder: 'app',

    init: function()
    {
        // Setup translations
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

