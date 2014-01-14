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
                text : 'Add...',
                menu : {
                    xtype: 'menu',
                    items : [{
                        text: 'Slide components',
                        menu: { //  submenu
                            items: [
                                {
                                    id:'title',
                                    text: 'Title',
                                    action: 'addField'
                                }, {
                                    id:'subtitle',
                                    text: 'Subtitle',
                                    action: 'addField'
                                }
                            ]
                        }
                    },{
                        text: 'Text',
                        menu: { //  submenu
                            items: [
                                {
                                    id:'story',
                                    text: tr('Main text', 'common'),
                                    action: 'addField'
                                }, {
                                    id:'left_column',
                                    text: tr('Left column text', 'common'),
                                    action: 'addField'
                                }, {
                                    id:'right_column',
                                    text: tr('Right column text', 'common'),
                                    action: 'addField'
                                }, {
                                    id:'text',
                                    text: tr('Other text', 'common'),
                                    action: 'addField'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Picture',
                        menu: { //  submenu
                            items: [
                                {
                                    id:'picture',
                                    text: tr('Picture', 'common'),
                                    action: 'addField'
                                }, {
                                    id:'left_picture',
                                    text: tr('Left picture', 'common'),
                                    action: 'addField'
                                }, {
                                    id:'right_picture',
                                    text: tr('Right picture', 'common'),
                                    action: 'addField'
                                }
                            ]
                        }
                    },
                    {
                        text: 'Movie',
                        menu: { //  submenu
                            items: [
                                {
                                    id:'movie',
                                    text: tr('Movie', 'common'),
                                    action: 'addField'
                                }, {
                                    id:'left_movie',
                                    text: tr('Left movie', 'common'),
                                    action: 'addField'
                                }, {
                                    id:'right_movie',
                                    text: tr('Right movie', 'common'),
                                    action: 'addField'
                                }
                            ]
                        }
                    },
                    {
                        id:'chart',
                        text: tr('Chart', 'common'),
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
