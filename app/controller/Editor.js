Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    stores: [ 'Document' ],
    models: [ 'Document', 'Page' ],
    views: [
        'Editor',
        'document.PageList',
        'Tools'
    ],

    init: function() {
        this.control({
            'imageandcaption': {
                // All icons
                click: this.selectOnly
            },
            'theme': {
                click: this.themeClicked
            }
        });
        this.getDocumentStore().on({ 'load': this.showPages });
    },

    themeClicked: function(icon) {
        var tools = icon.up('tools'); // REVISIT? tools !== this.getToolsView(). Why?
        tools.setPageTemplates(icon.getPageTemplatesPanel());

        Ext.each(Ext.ComponentQuery.query('theme'), function(child) {
            child.toggleCurrentTheme(child === icon);
        });
    },

    selectOnly: function(icon) {
        Ext.each(Ext.ComponentQuery.query('imageandcaption'), function(child) {
            child.toggleSelected(child === icon);
        });
    },

    showPages: function(store, records, successful) {
        if (successful === false) {
            console.log('Failed to load document');
            return;
        }

        var doc = store.first().raw;
        console.log(doc);
    }
});
