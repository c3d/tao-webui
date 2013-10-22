Ext.define('TE.themes.seyes.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.seyes.view.PageTemplates'
    },
    image: 'app/themes/seyes/resources/images/seyes.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.seyes.i18n.fr').translations, 'seyes');
        }
        this.caption = tr('Seyes', 'seyes');
        this.callParent(arguments);
    }
 });
