Ext.define('TE.themes.blueclaire.view.properties.MovieSlide', {
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
                        xtype: 'textfield',
                        name: 'movie',
                        fieldLabel: tr('Filename, path or URL of video', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviescalepercent',
                        fieldLabel: tr('Movie scale (%)', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviex',
                        fieldLabel: tr('Movie horizontal position', 'blueclaire')
                    },
                    {
                        xtype: 'numberfield',
                        name: 'moviey',
                        fieldLabel: tr('Movie vertical position', 'blueclaire')
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
