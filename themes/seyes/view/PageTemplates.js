Ext.define('TE.themes.seyes.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Seyes', 'seyes'),

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
            this.items.push(Ext.create('TE.themes.seyes.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
