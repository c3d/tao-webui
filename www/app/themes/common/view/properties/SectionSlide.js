Ext.define('TE.themes.common.view.properties.SectionSlide', {
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
                        xtype: 'textfield',
                        name: 'title',
                        fieldLabel: tr('Title', 'common')
                    },
                    {
                        xtype: 'textfield',
                        name: 'subtitle',
                        fieldLabel: tr('Subtitle', 'common')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
