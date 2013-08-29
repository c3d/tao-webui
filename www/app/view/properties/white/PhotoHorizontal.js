Ext.define('TE.view.properties.white.PhotoHorizontal', {
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
                        fieldLabel: 'Page name'
                    },
                    {
                        xtype: 'textfield',
                        name: 'properties~photo',
                        fieldLabel: 'Photo'
                    },
                    {
                        xtype: 'textfield',
                        name: 'properties~caption',
                        fieldLabel: 'Caption'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
