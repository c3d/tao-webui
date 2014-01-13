Ext.define('TE.themes.common.view.properties.BaseSlide', {
    requires: ['TE.util.CustomHtmlEditor', 'TE.util.CustomDisplayField', 'TE.util.CustomChartEditor', 'TE.util.CustomDynamicFields', 'TE.util.CustomPictureField' ],
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
                        xtype: 'te_customdynamicfields',
                        name: 'dynamicfields'
                    }
                ])
            }
        ];

        this.callParent(arguments);
    }
});
