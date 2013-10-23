Ext.define('TE.themes.autumn_on_earth.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.autumn_on_earth.view.PageTemplates'
    },
    image: 'app/themes/autumn_on_earth/resources/images/autumn_on_earth.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.autumn_on_earth.i18n.fr').translations, 'autumn_on_earth');
        }
        this.caption = tr('Autumn on Earth', 'autumn_on_earth');
        this.callParent(arguments);
    }
 });
