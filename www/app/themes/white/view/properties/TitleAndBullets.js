Ext.define('TE.themes.white.view.properties.TitleAndBullets', {
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
                        fieldLabel: tr('Page name', 'white')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'bullets',
                        fieldLabel: tr('Bullet text', 'white')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
