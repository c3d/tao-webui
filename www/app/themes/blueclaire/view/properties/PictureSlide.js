Ext.define('TE.themes.blueclaire.view.properties.PictureSlide', {
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
                        xtype: 'teimagepickerfield',
                        name: 'picture',
                        fieldLabel: tr('Picture', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'scalepercent',
                        fieldLabel: tr('Scale (%)', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'imagex',
                        fieldLabel: tr('Picture horizontal position', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'imagey',
                        fieldLabel: tr('Picture vertical position', 'blueclaire')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
