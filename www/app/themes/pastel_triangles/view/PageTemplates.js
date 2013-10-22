Ext.define('TE.themes.pastel_triangles.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Pastel Triangles', 'pastel_triangles'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'Slide',
            'PictureSlide',
            'MovieSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.pastel_triangles.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
