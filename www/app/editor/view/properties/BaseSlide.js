Ext.define('TE.editor.view.properties.BaseSlide', {
    requires: ['TE.util.HtmlEditor',
               'TE.util.DisplayField',
               'TE.util.ChartEditor',
               'TE.util.DynamicFields',
               'TE.util.PictureField',
               'TE.util.TextField' ],
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
                        xtype: 'te_textfield',
                        name: 'name',
                        vtype: 'pagename',
                        title: tr('Page name', 'common')
                    },
                    {
                        xtype: 'te_dynamicfields',
                        id: 'dynamic',
                        name: 'dynamicfields'
                    }
                ])
            }
        ];

        this.callParent(arguments);
    }
});
