Ext.define('TE.themes.keyboard.view.properties.MovieSlide', {
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
                        xtype: 'textfield',
                        name: 'movie',
                        fieldLabel: tr('Filename, path or URL of video', 'keyboard')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviescalepercent',
                        fieldLabel: tr('Movie scale (%)', 'keyboard')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviex',
                        fieldLabel: tr('Movie horizontal position', 'keyboard')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviey',
                        fieldLabel: tr('Movie vertical position', 'keyboard')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'leftcolumn',
                        fieldLabel: tr('Left column text', 'keyboard')
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'rightcolumn',
                        fieldLabel: tr('Right column text', 'keyboard')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
