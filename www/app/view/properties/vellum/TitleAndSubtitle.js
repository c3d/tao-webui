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
                        fieldLabel: tr('Page name')
                    },
                    {
                        xtype: 'textfield',
                        name: 'title',
                        fieldLabel: tr('Title')
                    },
                    {
                        xtype: 'textfield',
                        name: 'subtitle',
                        fieldLabel: tr('Subtitle')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
