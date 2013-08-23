Ext.define('TE.view.vellum.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Page Templates (Vellum)'),

    initComponent: function() {
        var names = [
            'TitleAndSubtitle',
            'TitleAndBullets',
            'TitleBulletsAndPhoto',
            'Blank'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.view.vellum.' + name));
        }, this);

        this.callParent(arguments);
    }
});
