Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',
    requires: [ 'Ext.window.MessageBox' ],

    stores: [ 'Pages', 'Images' ],
    models: [ 'Page', 'Image' ],
    views: [
        'Editor',
        'EditImageURL',
        'PageList',
        'PageListContextMenu',
        'PageTemplateContextMenu',
        'ImageLibrary',
        'Tools'
    ],
    refs: [
        // Make components accessible through this.getCenterpane(), this.getTools(), etc.
        { ref: 'centerpane', selector: '#centerpane' },
        { ref: 'tools', selector: '#tools' },
        { ref: 'pagelist', selector: 'pagelist' },
        { ref: 'themePanel', selector: '#themepanel' },
        { ref: 'pageContextMenu', selector: 'pagelistcontextmenu', xtype: 'pagelistcontextmenu', autoCreate: true },
        { ref: 'pageTemplateContextMenu', selector: 'pagetemplatecontextmenu', xtype: 'pagetemplatecontextmenu', autoCreate: true },
        { ref: 'pageMoveBeforeBtn', selector: 'pagelist button[action=pageBefore]' },
        { ref: 'pageMoveAfterBtn', selector: 'pagelist button[action=pageAfter]' },
        { ref: 'pageDeleteBtn', selector: 'pagelist button[action=pageDelete]' },
        { ref: 'imageLibraryGrid', selector: 'teimagelibrary gridpanel' },
        { ref: 'imageDeleteBtn', selector: 'teimagelibrary button[action=delete]' },
        { ref: 'imageEditBtn', selector: 'teimagelibrary button[action=edit]' }
    ],

    init: function() {
        this.control({
            '#themepanel': {
                render: this.loadThemes
            },
            'editor': {
                afterlayout: this.selectDefaultTheme
            },
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
                click: this.deletePage
            },
            '#ctx-menu-new-page': {
                click: this.newPageMenuItemClicked
            },
            '#ctx-menu-move-page-before': {
                click: this.movePageBefore
            },
            '#ctx-menu-move-page-after': {
                click: this.movePageAfter
            },
            'pagelist button[action=pageBefore]': {
                click: this.movePageBefore
            },
            'pagelist button[action=pageAfter]': {
                click: this.movePageAfter
            },
            'pagelist button[action=pageDelete]': {
                click: this.deletePage
            },
            'pagelist button[action=showPicLibrary]': {
                click: this.showImageLibrary
            },
            'teimagelibrary gridpanel': {
                select: this.libraryImageClicked,
                itemdblclick: this.editImage
            },
            'teimagelibrary button[action=delete]': {
                click: this.deleteImage
            },
            'teimagelibrary button[action=addUrl]': {
                click: this.addImageUrl
            },
            'teimagelibrary button[action=edit]': {
                click: this.editImage
            },
            'teeditimageurl button[action=save]': {
                click: this.saveImage
            }
        });
    },

    loadThemes: function() {
        this.getThemePanel().add(Ext.create('TE.view.blueclaire.Theme'));
        this.getThemePanel().add(Ext.create('TE.view.vellum.Theme'));
        this.getThemePanel().add(Ext.create('TE.view.white.Theme'));
    },

    selectDefaultTheme: function() {
        var dflt = this.getThemePanel().items.items[0];
        this.themeClicked(dflt);
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
        this.getPagelist().getSelectionModel().deselectAll();
        this.getCenterpane().removeAll();
        this.getThemePanel().collapse(Ext.Component.DIRECTION_TOP, true);
    },

    pageTemplateClicked: function(pt) {
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'), function(child) {
            child.toggleSelected(child === pt);
        });
        this.getPagelist().getSelectionModel().deselectAll();
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
        var id = record.get('id');
        var exactmodel = Ext.ModelManager.getModel(record.getModelClassName());
        exactmodel.load(id, {
            scope: this,
            success: function(newrecord, operation) {
                newrecord.generic_record = record;
                ctrl.display(newrecord);
            }
        });

        this._updatePageButtons();
    },

    _updatePageButtons: function() {
        // Enable or disable page move buttons. id identifies the currently selected page.
        var selected = this.selectedPage();
        if (selected === undefined)
        {
            this.getPageMoveBeforeBtn().setDisabled(true);
            this.getPageMoveAfterBtn().setDisabled(true);
            this.getPageDeleteBtn().setDisabled(true);
            return;
        }
        var id = selected.get('id');
        var rowIndex = this.getPagesStore().find('id', id);
        var last = this.getPagesStore().count() - 1;
        this.getPageMoveBeforeBtn().setDisabled(rowIndex === 0);
        this.getPageMoveAfterBtn().setDisabled(rowIndex === last);
        this.getPageDeleteBtn().setDisabled(false);
    },

    showPageContextMenu: function(table, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        e.stopEvent();
        var menu = this.getPageContextMenu();
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

    deletePage: function() {
        var me = this;
        var store = this.getPagesStore();
        var page = this.selectedPage();
        var pageId = page.get('id');

        var box = Ext.create(Ext.window.MessageBox);
        box.confirm(tr('Delete page'),
                    tr('Are you sure you want to delete this page?') + '<br><br>[' + pageId + '] ' + page.get('name'),
                    function(button) {
                        if (button === 'yes') {
                            store.remove(page);
                            store.sync();
                            me._updatePageButtons();
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
    },

    selectedPage: function() {
        return this.getPagelist().getSelectionModel().getSelection()[0];
    },

    // delta = +/- 1
    movePage: function(delta) {
        var me = this;
        var record = this.selectedPage();
        var id = record.get('id');
        var store = this.getPagesStore();
        var index = store.find('id', id);
        var ctrl = this.application.getController(record.getControllerName());
        var exactmodel = Ext.ModelManager.getModel(record.getModelClassName());
        exactmodel.load(record.get('id'), {
            success: function(newrecord, operation) {
                newrecord.set('idx', index + delta);
                newrecord.save({
                    success: function() {
                        store.reload({
                            callback: function(records, operation, success) {
                                if (success)
                                    me._updatePageButtons();
                            }
                        });
                    }
                });
            }
        });
    },

    movePageBefore: function() {
        this.movePage(-1);
    },

    movePageAfter: function() {
        this.movePage(+1);
    },

    showImageLibrary: function() {
        Ext.widget('teimagelibrary');
    },

    libraryImageClicked: function() {
        this.getImageDeleteBtn().setDisabled(false);
        this.getImageEditBtn().setDisabled(false);
    },

    selectedImage: function() {
        return this.getImageLibraryGrid().getSelectionModel().getSelection()[0];
    },

    deleteImage: function() {
        var me = this;
        var image = this.selectedImage();

        var box = Ext.create(Ext.window.MessageBox);
        box.confirm(tr('Delete image'),
                    tr('Are you sure you want to delete this image?') +
                    '<br><br>' + image.get('displayname'),
                    function(button) {
                        if (button === 'yes') {
                            var store = me.getImagesStore();
                            store.remove(image);
                            store.sync();
                            me._updateImageLibraryButtons();
                        }
                    });
    },

    _updateImageLibraryButtons: function() {
        this.getImageDeleteBtn().setDisabled(this.selectedImage() === undefined);
    },

    addImageUrl: function() {
        var record = Ext.create(this.getImageModel(), { url: 'url', displayname: 'disp name' });
        var view = Ext.widget('teeditimageurl');
        view.down('form').loadRecord(record);
    },

    editImage: function() {
        var record = this.selectedImage();
        if (record.get('url').indexOf('://') === -1)
        {
            console.log('Don\'t know how to edit local file (yet)');
            return;
        }
        var view = Ext.widget('teeditimageurl');
        view.down('form').loadRecord(record);
    },

    saveImage: function(button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            store = this.getImagesStore();
        record.set(values);
        win.close();
        if (record.get('id') === undefined)
        {
            store.add(record);
        }
        store.sync();
    }
});
