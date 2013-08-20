Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    // stores: [ 'Users' ],
    // models: [ 'User' ],
    views: [
        'Editor',
        'ImageAndCaption',
        'PageList',
        'ThemeIcon',
        'Tools'
    ],

    init: function() {
        console.log('controller.Editor init');
        this.control({
            // Test
            'themeicon': {
                click: this.themeClicked
            }
        });
    },

    themeClicked: function(themeicon) {
        var tools = themeicon.up('tools');
        tools.setPageTemplates(themeicon.getPageTemplatesPanel());
    }
});
