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
        items: [{
                text: tr('Add'),
                menu : {
                    xtype: 'menu',
                    items : [
                    {
                        id:'title',
                        text: tr('Title'),
                        action: 'addField'
                    }, {
                        id:'subtitle',
                        text: tr('Subtitle'),
                        action: 'addField'
                    }
                    ,{
                        text: tr('Text'),
                        menu: { //  submenu
                            items: [
                                {
                                    id:'story',
                                    text: tr('Main text'),
                                    action: 'addField'
                                }, {
                                    id:'left_column',
                                    text: tr('Left column text'),
                                    action: 'addField'
                                }, {
                                    id:'right_column',
                                    text: tr('Right column text'),
                                    action: 'addField'
                                }, {
                                    id:'text',
                                    text: tr('Other text'),
                                    action: 'addField'
                                }
                            ]
                        }
                    },
                    {
                        text: tr('Picture'),
                        menu: { //  submenu
                            items: [
                                {
                                    id:'picture',
                                    text: tr('Picture'),
                                    action: 'addField'
                                }, {
                                    id:'left_picture',
                                    text: tr('Left picture'),
                                    action: 'addField'
                                }, {
                                    id:'right_picture',
                                    text: tr('Right picture'),
                                    action: 'addField'
                                }
                            ]
                        }
                    },
                    {
                        text: tr('Movie'),
                        menu: { //  submenu
                            items: [
                                {
                                    id:'movie',
                                    text: tr('Movie'),
                                    action: 'addField'
                                }, {
                                    id:'left_movie',
                                    text: tr('Left movie'),
                                    action: 'addField'
                                }, {
                                    id:'right_movie',
                                    text: tr('Right movie'),
                                    action: 'addField'
                                }
                            ]
                        }
                    },
                    {
                        id:'chart',
                        text: tr('Chart'),
                        action: 'addField'
                    }]
                }
             },
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
