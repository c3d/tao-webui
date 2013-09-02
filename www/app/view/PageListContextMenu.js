Ext.define('TE.view.PageListContextMenu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.pagelistcontextmenu',

    items: [{
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