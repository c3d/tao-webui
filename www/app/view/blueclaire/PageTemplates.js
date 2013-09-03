Ext.define('TE.view.blueclaire.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Page Templates (Blue Claire)'),

    initComponent: function() {
        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'Slide',
            'PictureSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.view.blueclaire.' + name));
        }, this);

        this.callParent(arguments);
    }
});
