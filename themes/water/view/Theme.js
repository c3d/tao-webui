Ext.define('TE.themes.water.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.water.view.PageTemplates'
    },
    image: 'app/themes/water/resources/images/water.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.water.i18n.fr').translations, 'water');
        }
        this.caption = tr('Water', 'water');
        this.callParent(arguments);
    }
 });
