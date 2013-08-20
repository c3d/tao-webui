Ext.define('TE.view.Tools', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tools',

    title: tr('Tools'),

    layout: {
    	type: 'accordion',
    	multi: true
    },

    items: [{
    	title: tr('Themes & Applications'),
        xtype: 'panel',
        autoScroll: true,
        layout: {
            type: 'vbox',
            align: 'center',
            defaultMargins: 5
        },
        items: [{
            xtype: 'themeicon',
            image: 'app/assets/images/vellum/vellum.png',
            caption: 'Vellum'
        }]
    }, {
        xtype: 'panel'
    }],

    initComponent: function() {
        console.log('view.Tools initComponent');

        this.callParent(arguments);
    },

    setPageTemplates: function(panel) {
        this.remove(1);
        this.add(panel);
    }
 });
