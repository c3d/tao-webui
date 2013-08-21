Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    views: [
        'Editor',
        'PageList',
        'Tools'
    ],

    init: function() {
        this.control({
            'imageandcaption': {
                // All icons
                click: this.highlightOnly
            },
            'themeicon': {
                click: this.themeIconClicked
            }
        });
    },

    themeIconClicked: function(icon) {
        var tools = icon.up('tools');
        tools.setPageTemplates(icon.getPageTemplatesPanel());

        Ext.each(Ext.ComponentQuery.query('themeicon'), function(child) {
            child.toggleBoldCaption(child === icon);
        });
    },

    highlightOnly: function(icon) {
        Ext.each(Ext.ComponentQuery.query('imageandcaption'), function(child) {
            child.toggleHighlight(child === icon);
        });
    }
});
