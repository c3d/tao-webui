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
                        xtype: 'textfield',
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
                        xtype: 'customhtmleditor',
                        name: 'leftcolumn',
                        fieldLabel: tr('Left column text', 'common')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'rightcolumn',
                        fieldLabel: tr('Right column text', 'common')
                    }
                ])
            }
        ];

        this.callParent(arguments);
    }
});
