Ext.define('TE.view.Editor', {
    extend: 'Ext.Container',
    layout: 'border',
    alias: 'widget.editor',

    items: [{
        xtype: 'pagelist',
        region: 'south',
        height: 200,
        collapsible: true,
        split: true, // enable resizing
        margins: '0 3 3 3'
    },{
        xtype: 'tools',
        region: 'west',
        width: 170,
        collapsible: true,
        split: true, // enable resizing
        margins: '3 0 0 3'
    },{
        title: tr('Properties'),
        region: 'center',
        margins: '3 3 0 0',
    }],

    initComponent: function() {
        this.callParent(arguments);
     }
 });
