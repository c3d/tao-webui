Ext.define('TE.view.properties.vellum.TitleAndSubtitle', {
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
                        name: 'properties~title',
                        fieldLabel: 'Title'
                    },
                    {
                        xtype: 'textfield',
                        name: 'properties~subtitle',
                        fieldLabel: 'Subtitle'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
