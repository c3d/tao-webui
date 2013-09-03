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
        xtype: 'panel',
        itemId: 'placeholder'
    }],

    // REVISIT: move code to controller.Editor

    initComponent: function() {
        this.callParent(arguments);

        var themepanel = this.getComponent('themepanel');

        themepanel.add(Ext.create('TE.view.blueclaire.Theme'));

        themepanel.add(Ext.create('TE.view.vellum.Theme'));
        themepanel.add(Ext.create('TE.view.white.Theme'));
    },

    setPageTemplates: function(tmpl) {
        var comp = this.items.items[1];
        // Placeholder may be deleted, not objects passed to this function (they are cached)
        var del = typeof comp.itemId !== 'undefined' && comp.itemId === 'placeholder';
        this.remove(1, del);
        this.add(tmpl);
    }
 });
