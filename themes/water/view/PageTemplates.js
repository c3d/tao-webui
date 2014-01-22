Ext.define('TE.themes.water.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Water', 'water'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'BaseSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.water.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
