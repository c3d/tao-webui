Ext.define('TE.themes.lucky_stars.view.properties.TextCrawl', {
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
                        fieldLabel: tr('Page name', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'crawl_duration',
                        fieldLabel: tr('Text crawl duration (s)', 'lucky_stars')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'text',
                        fieldLabel: tr('Text', 'common')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
