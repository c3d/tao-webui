Ext.define('TE.themes.finance.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.finance.view.PageTemplates'
    },
    image: 'app/themes/finance/resources/images/finance.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.finance.i18n.fr').translations, 'finance');
        }
        this.caption = tr('Finance', 'finance');
        this.callParent(arguments);
    }
 });
