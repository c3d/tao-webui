Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    stores: [ 'Pages' ],
    models: [ 'Page' ],
    views: [
        'Editor',
        'PageList',
        'Tools'
    ],
    refs: [
        // Make components accessible through this.getCenterpane(), this.getTools(), etc.
        { ref: 'centerpane', selector: '#centerpane' },
        { ref: 'tools', selector: '#tools' }
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
        this.getTools().setPageTemplates(theme.getPageTemplatesPanel());

        Ext.each(Ext.ComponentQuery.query('theme'), function(child) {
            child.toggleCurrentTheme(child === theme);
            child.toggleSelected(child === theme);
        });
        Ext.each(Ext.ComponentQuery.query('pagetemplate'), function(child) {
            child.toggleSelected(false);
        })
        Ext.ComponentQuery.query('pagelist')[0].getSelectionModel().deselectAll();

        // TESTING Create/Update/Delete operations
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

    pageClicked: function(grid, record) {
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'), function(child) {
            child.toggleSelected(false);
        });

        // Make sure controller for the specific kind of page is loaded
        var ctrl = this.application.getController(record.getControllerName());

        // Reload record, applying the suitable data model for the page
        var exactmodel = Ext.ModelManager.getModel(record.getModelClassName());
        exactmodel.load(record.get('id'), {
            scope: this,
            success: function(record, operation) {
                ctrl.display(record);
            }
        });
    }
});
