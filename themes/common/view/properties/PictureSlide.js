Ext.define('TE.themes.common.view.properties.PictureSlide', {
    requires: ['TE.util.CustomHtmlEditor'],
    extend: 'Ext.Container',

    initComponent: function(itemsBefore) {

        itemsBefore = itemsBefore || [];
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
                items: itemsBefore.concat([
                    {
                        xtype: 'textfield',
                        name: 'name',
                        allowBlank: false,
                        vtype: 'pagename',
                        msgTarget: 'under',
                        fieldLabel: tr('Page name', 'common')
                    },
                    {
                        xtype: 'teimagepickerfield',
                        name: 'picture',
                        fieldLabel: tr('Picture', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturescalepercent',
                        fieldLabel: tr('Picture scale (%)', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturex',
                        fieldLabel: tr('Picture horizontal position', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picturey',
                        fieldLabel: tr('Picture vertical position', 'common')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'leftcolumn',
                        fieldLabel: tr('Left column text', 'common')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'rightcolumn',
                        fieldLabel: tr('Right column text', 'common')
                    }
                ])
            }
        ];

        this.callParent(arguments);
    }
});
