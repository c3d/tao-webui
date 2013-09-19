Ext.define('TE.themes.blueclaire.view.properties.Slide', {
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
                        xtype: 'customhtmleditor',
                        name: 'text',
                        fieldLabel: tr('Text', 'blueclaire')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
