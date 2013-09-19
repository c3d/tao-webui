Ext.define('TE.themes.vellum.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Vellum', 'vellum'),

    initComponent: function() {
        var names = [
            'TitleAndSubtitle',
            'TitleAndBullets',
            'TitleBulletsAndPhoto',
            'Blank'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.vellum.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
