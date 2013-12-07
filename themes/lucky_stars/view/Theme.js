Ext.define('TE.themes.lucky_stars.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.lucky_stars.view.PageTemplates'
    },
    image: 'app/themes/lucky_stars/resources/images/lucky_stars.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.lucky_stars.i18n.fr').translations, 'lucky_stars');
        }
        this.caption = tr('Lucky Stars', 'lucky_stars');
        this.callParent(arguments);
    }
 });
