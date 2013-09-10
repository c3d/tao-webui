Ext.define('TE.view.Tools', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tools',

    title: tr('Tools'),

    layout: {
    	type: 'accordion',
    	multi: true
    },

    items: [{
    	title: tr('Themes'),
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

    setPageTemplates: function(tmpl) {
        var comp = this.items.items[1];
        // Placeholder may be deleted, not objects passed to this function (they are cached)
        var del = typeof comp.itemId !== 'undefined' && comp.itemId === 'placeholder';
        this.remove(1, del);
        this.add(tmpl);
    }
 });
