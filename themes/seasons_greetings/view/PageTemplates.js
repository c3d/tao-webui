Ext.define('TE.themes.seasons_greetings.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Seasons Greetings', 'seasons_greetings'),

    initComponent: function() {

        var names = [
            'MainTitleSlide',
            'SectionSlide',
            'BaseSlide'
        ];

        this.items = [];
        Ext.Array.forEach(names, function(name) {
            this.items.push(Ext.create('TE.themes.seasons_greetings.view.' + name));
        }, this);

        this.callParent(arguments);
    }
});
