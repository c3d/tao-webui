Ext.define('TE.themes.keyboard.view.properties.Slide', {
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
                        xtype: 'customhtmleditor',
                        name: 'text',
                        fieldLabel: tr('Text', 'keyboard')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
