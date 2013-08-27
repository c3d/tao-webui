Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    stores: [ 'Pages' ],
    models: [ 'Page' ],
    views: [
        'Editor',
        'PageList',
        'Tools'
    ],

    init: function() {
        this.control({
            'pagetemplate': {
                click: this.pageTemplateClicked
            },
            'theme': {
                click: this.themeClicked
            },
            'pagelist': {
                select: this.pageClicked
            }
        });
    },

    themeClicked: function(theme) {
        var tools = theme.up('tools'); // REVISIT? tools !== this.getToolsView(). Why?
        tools.setPageTemplates(theme.getPageTemplatesPanel());

        Ext.each(Ext.ComponentQuery.query('theme'), function(child) {
            child.toggleCurrentTheme(child === theme);
            child.toggleSelected(child === theme);
        });
        Ext.each(Ext.ComponentQuery.query('pagetemplate'), function(child) {
            child.toggleSelected(false);
        })
        Ext.ComponentQuery.query('pagelist')[0].getSelectionModel().deselectAll();

        //TESTING
        // var store = this.getPagesStore();
        // var newpage = Ext.create('TE.model.Page', { name: 'Nouvelle page', ptclass: '' });
        // newpage.save(); // POST
        // var first = store.first();
        // first.set('name', 'Modified');
        // first.save(); // PUT
        // var last = this.getPagesStore().last();
        // last.destroy(); // DELETE
    },

    pageTemplateClicked: function(pt) {
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'), function(child) {
            child.toggleSelected(child === pt);
        });
        Ext.ComponentQuery.query('pagelist')[0].getSelectionModel().deselectAll();
    },

    pageClicked: function() {
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'), function(child) {
            child.toggleSelected(false);
        });
    }
});
