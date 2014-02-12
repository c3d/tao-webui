Ext.define('TE.view.PageTemplates', {
    extend: 'Ext.panel.Panel',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'center',
        defaultMargins: 5
    },
    items: [],
    pageTemplates: [],
    initComponent: function() {
        Ext.Array.forEach(this.pageTemplates, function(name) {
            this.items.push(Ext.create('TE.view.PageTemplate', {
                image: 'app/themes/' + name + '.pt.png',
                caption: name
            }));
        }, this);
        this.callParent(arguments);
    }
});
