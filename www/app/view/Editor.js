Ext.define('TE.view.Editor', {
    extend: 'Ext.Container',
    layout: 'border',
    alias: 'widget.editor',

    items: [{
        xtype: 'tools',
        itemId: 'tools',
        region: 'west',
        width: 185,
        collapsible: true,
        split: true, // enable resizing
        margins: '3 0 0 3'
    },{
        xtype: 'panel',
        itemId: 'centerpane',
        layout: 'fit',
        title: tr('Editor'),
        region: 'center',
        autoScroll: true,
        margins: '3 3 0 0'
    },{
        xtype: 'properties',
        itemId: 'properties',
        region: 'east',
        autoScroll: true,
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
                text: tr('Image library') + '...',
                icon: 'app/resources/images/image.png',
                action: 'showPicLibrary'
            },
            {
                xtype: 'button',
                text: tr('Video library') + '...',
                icon: 'app/resources/images/video.png',
                action: 'showVidLibrary'
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
