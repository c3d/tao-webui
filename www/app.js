var tr = (typeof tr !== 'undefined') ? tr : function (txt) { return txt };

Ext.application({
    name: 'TE',  // 'Tao Editor'
    requires: ['Ext.container.Viewport'],

    appFolder: 'app',

    controllers: [
        'Editor'
    ],

    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: 'editor'
                }
            ]
        });
    }
});
