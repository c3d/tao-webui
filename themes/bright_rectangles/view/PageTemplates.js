Ext.define('TE.themes.bright_rectangles.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Bright Rectangles', 'bright_rectangles'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'BaseSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.bright_rectangles.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
