Ext.define('TE.themes.black_white.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.black_white.view.PageTemplates'
    },
    image: 'app/themes/black_white/resources/images/black_white.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.black_white.i18n.fr').translations, 'black_white');
        }
        this.caption = tr('Black and White', 'black_white');
        this.callParent(arguments);
    }
 });
