Ext.define('TE.view.PageTemplates', {
    extend: 'Ext.panel.Panel',
    autoScroll: true,
    layout: {
        type: 'vbox',
        align: 'center',
        defaultMargins: 5
    },
    items: [],
    initComponent: function() {
        if (this.pageTemplates) {
            this.items = [];
            Ext.Array.forEach(this.pageTemplates, function(name) {
                var shortName = name.replace(/.*\//, '');
                this.items.push(Ext.create('TE.view.PageTemplate', {
                    image: 'themes/' + name + '.pt.png',
                    model: name,
                    caption: shortName,
                    pageTemplate: shortName
                }));
            }, this);
        }
        this.callParent(arguments);
    }
});
