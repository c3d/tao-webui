
Ext.define('TE.view.properties.vellum.TitleBulletsAndPhoto', {
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
                        fieldLabel: 'Page name'
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'bullets',
                        fieldLabel: 'Bullet text'
                    },
                    {
                        xtype: 'textfield',
                        name: 'photo',
                        fieldLabel: 'Photo'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
