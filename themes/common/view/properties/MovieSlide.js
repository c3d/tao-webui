Ext.define('TE.themes.common.view.properties.MovieSlide', {
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
                        xtype: 'tevideopickerfield',
                        name: 'movie',
                        fieldLabel: tr('Filename, path or URL of video', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviescalepercent',
                        fieldLabel: tr('Movie scale (%)', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviex',
                        fieldLabel: tr('Movie horizontal position', 'common')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviey',
                        fieldLabel: tr('Movie vertical position', 'common')
                    },
                    {
                        xtype: 'te_displayfield',
                        name: 'left_column',
                        fieldLabel: tr('Left column text', 'common')
                    },
                    {
                        xtype: 'te_displayfield',
                        name: 'right_column',
                        fieldLabel: tr('Right column text', 'common')
                    }
                ])
            }
        ];

        this.callParent(arguments);
    }
});
