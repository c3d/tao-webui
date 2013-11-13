Ext.define('TE.themes.landscapes.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.landscapes.view.PageTemplates'
    },
    image: 'app/themes/landscapes/resources/images/landscapes.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.landscapes.i18n.fr').translations, 'landscapes');
        }
        this.caption = tr('Landscapes', 'landscapes');
        this.callParent(arguments);
    }
 });
