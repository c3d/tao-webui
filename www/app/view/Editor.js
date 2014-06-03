Ext.define('TE.view.Editor', {
    extend: 'Ext.Container',
    layout: 'border',
    alias: 'widget.editor',
    itemId: 'mainEditor',

    items:
    [
        {
            xtype: 'tools',
            itemId: 'tools',
            region: 'west',
            width: 185,
            collapsible: true,
            split: true
        },
        {
            xtype: 'panel',
            layout: { type: 'vbox', align: 'stretch' },
            region: 'center',

            items: [{
                xtype: 'panel',
                itemId: 'centerpane',
                layout: 'fit',
                title: tr('Editor'),
                autoScroll: true,
                collapsible: true,
                split: true,
                flex: 4,
                minSize: 250
            },{
                xtype: 'panel',
                itemId: 'sourcecode',
                layout: 'fit',
                title: tr('Source code'),
                autoScroll: true,
                collapsible: true,
                collapsed: true,
                split: true,
                flex: 3,
                minSize: 150
            }]
        },
        {
            xtype: 'properties',
            itemId: 'properties',
            region: 'east',
            autoScroll: true,
            width: 350,
            collapsible: true,
            split: true
        },
        {
            xtype: 'toolbar',
            region: 'south',
            items:
            [
                {
                    text: tr('Add'),
                    menu:
                    {
                        xtype: 'menu',
                        id: 'add_menu',
                        items : []
                    }
                },
                {
                    xtype: 'button',
                    text: tr('Image library') + '...',
                    icon: 'app/resources/images/image.png',
                    action: 'showImageLibrary'
                },
                {
                    xtype: 'button',
                    text: tr('3D image library') + '...',
                    icon: 'app/resources/images/mvimage.png',
                    action: 'showMvImageLibrary'
                },
                {
                    xtype: 'button',
                    text: tr('Movie library') + '...',
                    icon: 'app/resources/images/movie.png',
                    action: 'showMovieLibrary'
                },
                {
                    xtype: 'button',
                    text: tr('3D model library') + '...',
                    icon: 'app/resources/images/model.png',
                    action: 'showModelLibrary'
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
        }
    ]
});
