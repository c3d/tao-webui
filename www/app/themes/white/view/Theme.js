Ext.define('TE.themes.white.view.Theme', {
    extend: 'TE.view.Theme',

    statics: {
	    ptclassname: 'TE.themes.white.view.PageTemplates',
    },
    image: 'app/themes/white/resources/images/white.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr')
            trans.register(Ext.create('TE.themes.white.i18n.fr').translations, 'white');
        this.caption = tr('White', 'white');
        this.callParent(arguments);
    }
 });
