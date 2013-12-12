Ext.define('TE.view.Properties', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.properties',

    title: tr('Properties'),

    layout: 'fit',

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
    }]
 });
