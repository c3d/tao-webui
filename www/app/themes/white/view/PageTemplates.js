Ext.define('TE.themes.white.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('White', 'white'),

    initComponent: function() {
        var names = [
            'TitleAndSubtitle',
            'TitleAndBullets',
            'TitleBulletsAndPhoto',
            'PhotoHorizontal',
            'Blank'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.white.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
