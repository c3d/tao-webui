Ext.define('TE.themes.white.view.properties.PhotoHorizontal', {
    extend: 'Ext.Container',

    initComponent: function() {

        this.items = [
            {
                xtype: 'form',
                border: 0,
			    padding: 10,

			    defaults: {
                    labelAlign: 'top',
                    labelPad: 10,
                    anchor: '100%'
			    },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        fieldLabel: tr('Page name', 'white')
                    },
                    {
                        xtype: 'textfield',
                        name: 'photo',
                        fieldLabel: tr('Photo', 'white')
                    },
                    {
                        xtype: 'textfield',
                        name: 'caption',
                        fieldLabel: tr('Caption', 'white')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
