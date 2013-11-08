Ext.define('TE.themes.keyboard.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Keyboard', 'keyboard'),

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
            this.items.push(Ext.create('TE.themes.keyboard.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
