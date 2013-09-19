Ext.define('TE.themes.blueclaire.view.Theme', {
    extend: 'TE.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.blueclaire.view.PageTemplates'
    },
    image: 'app/themes/blueclaire/resources/images/blue_claire.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr')
            trans.register(Ext.create('TE.themes.blueclaire.i18n.fr').translations);
        this.caption = tr('Blue Claire');
        this.callParent(arguments);
    }
 });
