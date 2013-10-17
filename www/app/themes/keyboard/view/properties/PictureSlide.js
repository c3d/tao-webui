Ext.define('TE.themes.keyboard.view.properties.PictureSlide', {
    requires: ['TE.util.CustomHtmlEditor'],
    extend: 'Ext.Container',

    initComponent: function() {

        this.items = [
            {
                xtype: 'form',
                border: 0,
			    padding: 10,
                trackResetOnLoad: true,

			    defaults: {
                    labelAlign: 'top',
                    labelPad: 10,
                    anchor: '100%'
			    },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        allowBlank: false,
                        vtype: 'pagename',
                        msgTarget: 'under',
                        fieldLabel: tr('Page name', 'keyboard')
                    },
                    {
                        xtype: 'teimagepickerfield',
                        name: 'picture',
                        fieldLabel: tr('Picture', 'keyboard')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturescalepercent',
                        fieldLabel: tr('Picture scale (%)', 'keyboard')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturex',
                        fieldLabel: tr('Picture horizontal position', 'keyboard')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturey',
                        fieldLabel: tr('Picture vertical position', 'keyboard')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'leftcolumn',
                        fieldLabel: tr('Left column text', 'keyboard')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'rightcolumn',
                        fieldLabel: tr('Right column text', 'keyboard')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
