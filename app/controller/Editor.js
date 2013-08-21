Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    views: [
        'Editor',
        'PageList',
        'Tools'
    ],

    init: function() {
        this.control({
            'themeicon': {
                click: this.themeClicked
            }
        });
    },

    themeClicked: function(themeicon) {
        // Update list of page templates according to selected theme/app
        var tools = themeicon.up('tools');
        tools.setPageTemplates(themeicon.getPageTemplatesPanel());

        // Set caption of clicked item in bold and show a border
        var themePanel = tools.getComponent('themepanel');
        var children = themePanel.items ? themePanel.items.items : [];
        Ext.each(children, function(child) {
            child.toggleBoldCaption(child === themeicon);
            child.toggleHighlight(child === themeicon);
        });
    }
});
