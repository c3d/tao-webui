Ext.define('TE.themes.blueclaire.view.properties.PictureSlide', {
    requires: ['TE.util.CustomHtmlEditor'],
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
                        name: 'picturescalepercent',
                        fieldLabel: tr('Picture scale (%)', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturex',
                        fieldLabel: tr('Picture horizontal position', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturey',
                        fieldLabel: tr('Picture vertical position', 'blueclaire')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'leftcolumn',
                        fieldLabel: tr('Left column text', 'blueclaire')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'rightcolumn',
                        fieldLabel: tr('Right column text', 'blueclaire')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
