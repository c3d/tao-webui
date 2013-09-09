Ext.define('TE.view.PageListContextMenu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.pagelistcontextmenu',

    items: [{
        text: tr('Move up'),
        icon: 'app/resources/images/page-up.gif',
        itemId: 'ctx-menu-move-page-before'
    },
    {
        text: tr('Move down'),
        icon: 'app/resources/images/page-down.gif',
        itemId: 'ctx-menu-move-page-after'
    },
    {
        text: tr('Delete'),
        icon: 'app/resources/images/delete.png',
    	itemId: 'ctx-menu-delete-page'
    }],

    setPage: function(pageId) {
    	this.pageId = pageId;
    },

    getPage: function() {
    	return this.pageId;
    }
});