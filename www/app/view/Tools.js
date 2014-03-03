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
            defaultmargins: 5
        },
        items: []
    }, {
        // Placeholder for the list of page templates in a theme
        xtype: 'panel',
        itemId: 'placeholder'
    }, {
        xtype: 'pagelist',
        autoScroll: true,
        layout: 'vbox'
    }],

    setPageTemplates: function(tmpl) {
        var component = this.items.items[1];
        var pageList = this.items.items[2];

        // Placeholder may be deleted, not objects passed to this function (they are cached)
        var del = typeof component.itemId !== 'undefined'
            &&           component.itemId === 'placeholder';
        this.remove(2, false);
        this.remove(1, del);
        this.add(tmpl);
        this.add(pageList);
    }
 });
