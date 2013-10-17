Ext.define('TE.themes.keyboard.view.Theme', {
    extend: 'TE.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.keyboard.view.PageTemplates'
    },
    image: 'app/themes/keyboard/resources/images/keyboard.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.keyboard.i18n.fr').translations, 'keyboard');
        }
        this.caption = tr('Keyboard', 'keyboard');
        this.callParent(arguments);
    }
 });
