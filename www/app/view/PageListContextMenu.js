Ext.define('TE.view.PageListContextMenu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.pagelistcontextmenu',

    items: [{
        text: tr('Move before'),
        icon: 'app/resources/images/page-up.gif',
        itemId: 'ctx-menu-move-page-before'
    },
    {
        text: tr('Move after'),
        icon: 'app/resources/images/page-down.gif',
        itemId: 'ctx-menu-move-page-after'
    },
    {
        text: tr('Delete'),
        icon: 'app/resources/images/delete.png',
    	itemId: 'ctx-menu-delete-page'
    }]
});