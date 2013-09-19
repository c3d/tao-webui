Ext.define('TE.themes.vellum.view.Theme', {
    extend: 'TE.view.Theme',

    statics: {
        ptclassname: 'TE.themes.vellum.view.PageTemplates'
    },
    image: 'app/themes/vellum/resources/images/vellum.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr')
            trans.register(Ext.create('TE.themes.vellum.i18n.fr').translations, 'vellum');
        this.caption = tr('Vellum', 'vellum');
        this.callParent(arguments);
    }
 });
