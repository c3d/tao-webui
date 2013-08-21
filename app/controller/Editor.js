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
                click: this.selectOnly
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
            child.toggleCurrentTheme(child === icon);
        });
    },

    selectOnly: function(icon) {
        Ext.each(Ext.ComponentQuery.query('imageandcaption'), function(child) {
            child.toggleSelected(child === icon);
        });
    }
});
