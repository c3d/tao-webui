Ext.define('TE.themes.landscapes.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Landscapes', 'landscapes'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'BaseSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.landscapes.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
