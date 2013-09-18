Ext.define('TE.themes.blueclaire.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Blue Claire'),

    initComponent: function() {
        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'Slide',
            'PictureSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.blueclaire.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});