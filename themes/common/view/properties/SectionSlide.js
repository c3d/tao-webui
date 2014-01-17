Ext.define('TE.themes.common.view.properties.SectionSlide', {
    extend: 'Ext.Container',
    requires: ['TE.util.CustomDynamicFields', 'TE.util.CustomTextField', 'TE.util.CustomDisplayField' ],
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
                        xtype: 'te_textfield',
                        name: 'title',
                        vtype: 'pagetitle',
                        title: tr('Title', 'common')
                    },
                    {
                        xtype: 'te_displayfield',
                        name: 'subtitle',
                        vtype: 'pagesubtitle',
                        title: tr('Subtitle', 'common')
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
