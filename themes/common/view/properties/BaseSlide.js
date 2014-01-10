Ext.define('TE.themes.common.view.properties.BaseSlide', {
    requires: ['TE.util.CustomHtmlEditor', 'TE.util.CustomDisplayField', 'TE.util.CustomChartEditor', 'TE.util.CustomDynamicFields' ],
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
                        name: 'picscale',
                        fieldLabel: tr('Picture scale (%)', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picx',
                        fieldLabel: tr('Picture horizontal position', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'picy',
                        fieldLabel: tr('Picture vertical position', 'common')
                    },
                    {
                        xtype: 'teimagepickerfield',
                        name: 'left_picture',
                        fieldLabel: tr('Left picture', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'lpicscale',
                        fieldLabel: tr('Left picture scale (%)', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'lpicx',
                        fieldLabel: tr('Left picture horizontal position', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'lpicy',
                        fieldLabel: tr('Left picture vertical position', 'common')
                    },
                    {
                        xtype: 'teimagepickerfield',
                        name: 'right_picture',
                        fieldLabel: tr('Right picture', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'rpicscale',
                        fieldLabel: tr('Right picture scale (%)', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'rpicx',
                        fieldLabel: tr('Right picture horizontal position', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'rpicy',
                        fieldLabel: tr('Right picture vertical position', 'common')
                    },
                    {
                        xtype: 'te_customdynamicfields',
                        name: 'dynamicfields'
                    }
                ])
            }
        ];

        this.callParent(arguments);
    }
});
