Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    stores: [ 'Pages' ],
    models: [ 'Page' ],
    views: [
        'Editor',
        'PageList',
        'PageListContextMenu',
        'PageTemplateContextMenu',
        'Tools'
    ],
    refs: [
        // Make components accessible through this.getCenterpane(), this.getTools(), etc.
        { ref: 'centerpane', selector: '#centerpane' },
        { ref: 'tools', selector: '#tools' },
        { ref: 'pagelist', selector: 'pagelist' },
        { ref: 'themePanel', selector: '#themepanel' },
        { ref: 'pageContextMenu', selector: 'pagelistcontextmenu', xtype: 'pagelistcontextmenu', autoCreate: true },
        { ref: 'pageTemplateContextMenu', selector: 'pagetemplatecontextmenu', xtype: 'pagetemplatecontextmenu', autoCreate: true }
    ],

    init: function() {
        this.control({
            'pagetemplate': {
                click: this.pageTemplateClicked,
                contextmenu: this.showPageTemplateContextMenu
            },
            'theme': {
                click: this.themeClicked
            },
            'pagelist': {
                select: this.pageClicked,
                cellcontextmenu: this.showPageContextMenu
            },
            '#ctx-menu-delete-page': {
                click: this.deletePageMenuItemClicked
            },
            '#ctx-menu-new-page': {
                click: this.newPageMenuItemClicked
            },
            '#ctx-menu-move-page-before': {
                click: this.pageBeforeMenuItemClicked
            },
            '#ctx-menu-move-page-after': {
                click: this.pageAfterMenuItemClicked
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
        this.getCenterpane().removeAll();
        this.getThemePanel().collapse(Ext.Component.DIRECTION_TOP, true);
    },

    pageTemplateClicked: function(pt) {
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'), function(child) {
            child.toggleSelected(child === pt);
        });
        Ext.ComponentQuery.query('pagelist')[0].getSelectionModel().deselectAll();
        this.getCenterpane().removeAll();
    },

    pageClicked: function(grid, record) {
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'), function(child) {
            child.toggleSelected(false);
        });

        // Make sure controller for the specific kind of page is loaded
        var ctrl = this.application.getController(record.getControllerName());

        // Reload record, applying the suitable data model for the page
        // REVISIT Use a store to cache data
        var exactmodel = Ext.ModelManager.getModel(record.getModelClassName());
        exactmodel.load(record.get('id'), {
            scope: this,
            success: function(newrecord, operation) {
                newrecord.generic_record = record;
                ctrl.display(newrecord);
            }
        });
    },

    showPageContextMenu: function(table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        e.stopEvent();
        var menu = this.getPageContextMenu();
        menu.setPage(record.get('id'));
        var last = this.getPagesStore().count() - 1;
        menu.getComponent('ctx-menu-move-page-before').setDisabled(rowIndex === 0);
        menu.getComponent('ctx-menu-move-page-after').setDisabled(rowIndex === last);
        menu.showAt(e.xy);
    },

    showPageTemplateContextMenu: function(pt, t) {
        var menu = this.getPageTemplateContextMenu();
        menu.setPageTemplate(pt);
        menu.showBy(t);
    },

    deletePageMenuItemClicked: function(item, e) {
        var pageId = this.getPageContextMenu().getPage();
        var store = this.getPagesStore();
        var page = store.findRecord('id', pageId);

        var box = Ext.create(Ext.window.MessageBox);
        box.confirm(tr('Delete page'),
                    tr('Are you sure you want to delete this page?') + '<br><br>[' + pageId + '] ' + page.get('name'),
                    function(button) {
                        if (button === 'yes') {
                            store.remove(page);
                            store.sync();
                        }
                    });
    },

    newPageMenuItemClicked: function() {
        var tmpl = this.getPageTemplateContextMenu().getPageTemplate();
        var model = tmpl.getModelClassName();
        var page = Ext.create(model);
        page.set('kind', model.replace('TE.model.', ''));
        page.set('name', tr('New page'));
        var store = this.getPagesStore();
        store.add(page);
        store.sync();

        // // TEST create at specific index (0 = first position)
        // var idx = 1;
        // page.set('idx', idx);
        // store.insert(idx, page);
        // store.sync({
        //     callback: function(batch, options) {
        //         page.set('idx', -1);
        //         console.log('-1');
        //     }
        // });
    },

    pageBeforeMenuItemClicked: function() {
        var pageId = this.getPageContextMenu().getPage();
        var store = this.getPagesStore();
        var index = store.find('id', pageId);
        var record = store.findRecord('id', pageId);
        var ctrl = this.application.getController(record.getControllerName());
        var exactmodel = Ext.ModelManager.getModel(record.getModelClassName());
        exactmodel.load(record.get('id'), {
            scope: this,
            success: function(newrecord, operation) {
                newrecord.set('idx', index - 1);
                newrecord.save({
                    success: function() {
                        store.reload();
                    }
                });
            }
        });
    },

    pageAfterMenuItemClicked: function() {
        var pageId = this.getPageContextMenu().getPage();
        var store = this.getPagesStore();
        var index = store.find('id', pageId);
        var record = store.findRecord('id', pageId);
        var ctrl = this.application.getController(record.getControllerName());
        var exactmodel = Ext.ModelManager.getModel(record.getModelClassName());
        exactmodel.load(record.get('id'), {
            scope: this,
            success: function(newrecord, operation) {
                newrecord.set('idx', index + 1);
                newrecord.save({
                    success: function() {
                        store.reload();
                    }
                });
            }
        });
    }
});
