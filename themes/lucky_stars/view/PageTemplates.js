Ext.define('TE.themes.lucky_stars.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Lucky Stars', 'lucky_stars'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'BaseSlide',
            'TextCrawl'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.lucky_stars.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
