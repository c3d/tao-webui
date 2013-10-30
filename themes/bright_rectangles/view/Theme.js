Ext.define('TE.themes.bright_rectangles.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.bright_rectangles.view.PageTemplates'
    },
    image: 'app/themes/bright_rectangles/resources/images/bright_rectangles.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.bright_rectangles.i18n.fr').translations, 'bright_rectangles');
        }
        this.caption = tr('Bright Rectangles', 'bright_rectangles');
        this.callParent(arguments);
    }
 });
