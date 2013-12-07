Ext.define('TE.themes.black_white.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Black and White', 'black_white'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'Slide',
            'PictureSlide',
            'MovieSlide',
            'BaseSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.black_white.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
