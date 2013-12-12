Ext.define('TE.view.Editor', {
    extend: 'Ext.Container',
    layout: 'border',
    alias: 'widget.editor',

    items: [{
        xtype: 'tools',
        itemId: 'tools',
        region: 'west',
        width: 170,
        collapsible: true,
        split: true, // enable resizing
        margins: '3 0 0 3'
    },{
        itemId: 'centerpane',
        title: tr('Layout'),
        region: 'center',
        autoScroll: true,
        margins: '3 3 0 0',
    },{
        xtype: 'properties',
        itemId: 'properties',
        region: 'east',
        width: 350,
        collapsible: true,
        split: true, // enable resizing
        margins: '3 0 0 3'
    },{
        xtype: 'toolbar',
        region: 'south',
        items: [
            {
                xtype: 'button',
                text: tr('Image library...'),
                icon: 'app/resources/images/image.png',
                action: 'showPicLibrary'
            },
            '->',
            {
                xtype: 'tbtext',
                itemId: 'statustext',
                text: '&nbsp;'
            }, {
                xtype: 'button',
                text: tr('Save'),
                action: 'savepage',
                tooltip: tr('Save changes (Ctrl+S)')
            }
        ]
    }]
 });
