Ext.define('TE.themes.blueclaire.view.properties.MainTitleSlide', {
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
                        fieldLabel: tr('Page name', 'blueclaire')
                    },
                    {
                        xtype: 'textfield',
                        name: 'title',
                        fieldLabel: tr('Title', 'blueclaire')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'subtitle',
                        fieldLabel: tr('Subtitle', 'blueclaire')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
