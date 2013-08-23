Ext.define('TE.view.white.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Page Templates (White)'),

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
            this.items.push(Ext.create('TE.view.white.' + name));
        }, this);

        this.callParent(arguments);
    }
});
