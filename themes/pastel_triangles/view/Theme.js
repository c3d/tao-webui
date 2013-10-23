Ext.define('TE.themes.pastel_triangles.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.pastel_triangles.view.PageTemplates'
    },
    image: 'app/themes/pastel_triangles/resources/images/pastel_triangles.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.pastel_triangles.i18n.fr').translations, 'pastel_triangles');
        }
        this.caption = tr('Pastel Triangles', 'pastel_triangles');
        this.callParent(arguments);
    }
 });
