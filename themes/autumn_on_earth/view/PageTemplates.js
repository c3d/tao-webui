Ext.define('TE.themes.autumn_on_earth.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Autumn on Earth', 'autumn_on_earth'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'BaseSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.autumn_on_earth.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
