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
            split: true, // enable resizing
            margins: '3 0 0 3'
        },
        {
            xtype: 'panel',
            itemId: 'centerpane',
            layout: 'fit',
            title: tr('Editor'),
            region: 'center',
            autoScroll: true,
            margins: '3 3 0 0'
        },
        {
            xtype: 'properties',
            itemId: 'properties',
            region: 'east',
            autoScroll: true,
            width: 350,
            collapsible: true,
            split: true, // enable resizing
            margins: '3 0 0 3'
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
