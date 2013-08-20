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
        itemId: 'themepanel',
        autoScroll: true,
        layout: {
            type: 'vbox',
            align: 'center',
            defaultMargins: 5
        },
        items: []
    }, {
        // Placeholder for the list of page templates
        xtype: 'panel'
    }],

    initComponent: function() {
        console.log('view.Tools initComponent');
        this.callParent(arguments);

        this.addThemeIcon(Ext.create('TE.view.vellum.ThemeIcon'));
        this.addThemeIcon(Ext.create('TE.view.white.ThemeIcon'));
    },

    addThemeIcon: function(panel) {
        console.log('addThemeIcon');
        this.getComponent('themepanel').add(panel);
    },

    setPageTemplates: function(panel) {
        this.remove(1);
        this.add(panel);
    }
 });
