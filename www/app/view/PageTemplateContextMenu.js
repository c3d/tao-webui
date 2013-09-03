Ext.define('TE.view.PageTemplateContextMenu', {
	extend: 'Ext.menu.Menu',
	alias: 'widget.pagetemplatecontextmenu',

    items: [{
        text: tr('New page from this template'),
        icon: 'app/resources/images/add.png',
        itemId: 'ctx-menu-new-page'
    }],

    setPageTemplate: function(pt) {
        this.pt = pt;
    },

    getPageTemplate: function() {
        return this.pt;
    }
});