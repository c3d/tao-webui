Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',
    requires: [ 'Ext.window.MessageBox' ],

    stores: [ 'Pages', 'Images' ],
    models: [ 'Page', 'Image' ],
    views: [
        'Editor',
        'EditImageFile',
        'EditImageURL',
        'ImagePickerField',
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
        { ref: 'imageEditBtn', selector: 'teimagelibrary button[action=edit]' },
        { ref: 'imageChooseBtn', selector: 'teimagelibrary button[action=choose]' },
        { ref: 'statusText', selector: '#centerpane toolbar #statustext'}
    ],

    init: function() {
        this.control({
            '#themepanel': {
                render: this.loadThemes
            },
            'pagetemplate': {
                click: this.pageTemplateClicked,
                dblclick: this.newPageFromTemplate,
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
                select: this._updateImageLibraryButtons,
                itemdblclick: this.editImage
            },
            'teimagelibrary button[action=delete]': {
                click: this.deleteImage
            },
            'teimagelibrary button[action=addUrl]': {
                click: this.addImageUrl
            },
            'teimagelibrary button[action=addFile]': {
                click: this.addImageFile
            },
            'teimagelibrary button[action=choose]': {
                click: this.chooseImage
            },
            'teimagelibrary button[action=edit]': {
                click: this.editImage
            },
            'teeditimageurl button[action=save]': {
                click: this.saveImageUrl
            },
            'teeditimagefile button[action=upload]': {
                click: this.uploadImage
            },
            '#centerpane button[action=savepage]': {
                click: this.savePage
            }
        });

        // Page name validator
        // To use it: set "trackResetOnLoad: true" on form and "vtype: 'pagename'" on form field
        var store = this.getPagesStore();
        Ext.apply(Ext.form.field.VTypes, {
            pagename: function(val, field) {
                if (field.originalValue === undefined || val === field.originalValue) {
                    return true;
                }
                return (store.findExact('name', val) === -1);
            },
            pagenameText: tr('This name is already used')
        });
    },

    loadThemes: function() {
        function load(theme) {
            try {
                this.getThemePanel().add(Ext.create('TE.themes.' + theme + '.view.Theme'));
            } catch (e) {
                console.log('Warning: failed to load theme: ' + theme);
                console.log(e);
            }
        }
        Ext.each(['blueclaire', 'vellum', 'white'], load, this);
    },

    onLaunch: function() {
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

        if (this.pagectrl)
            this.pagectrl.endDisplay();

        // Make sure controller for the specific kind of page is loaded
        var ctrl = this.application.getController(record.getControllerName());
        this.pagectrl = ctrl;

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
                    tr('Are you sure you want to delete this page?') + '<br>[' + pageId + '] ' + page.get('name'),
                    function(button) {
                        if (button === 'yes') {
                            store.remove(page);
                            store.sync();
                            me._updatePageButtons();
                        }
                    });
    },

    newPageMenuItemClicked: function() {
        this.newPageFromTemplate(this.getPageTemplateContextMenu().getPageTemplate());
    },

    newPageFromTemplate: function(tmpl) {
        var model = tmpl.getModelClassName();
        var page = Ext.create(model);
        var store = this.getPagesStore();
        // Example: TE.themes.blueclaire.model.PictureSlide -> blueclaire.PictureSlide
        page.set('kind', model.replace('TE.themes.', '').replace('.model', ''));
        function unusedPageName() {
            var i = 1;
            var stem = tr('New page');
            while (true) {
                var n = stem + ' ' + i++;
                if (store.find('name', n) === -1)
                    return n;
            }
        }
        page.set('name', unusedPageName());
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

    selectedImage: function() {
        return this.getImageLibraryGrid().getSelectionModel().getSelection()[0];
    },

    deleteImage: function() {
        var me = this;
        var image = this.selectedImage();

        var box = Ext.create(Ext.window.MessageBox);
        box.confirm(tr('Delete image'),
                    tr('Are you sure you want to delete this image?') +
                    '<br><br>' + image.get('description'),
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
        var disable = this.selectedImage() === undefined;
        this.getImageDeleteBtn().setDisabled(disable);
        this.getImageEditBtn().setDisabled(disable);
        this.getImageChooseBtn().setDisabled(disable);
    },

    addImageUrl: function() {
        var record = Ext.create(this.getImageModel(), { file: '', description: '' });
        var view = Ext.widget('teeditimageurl');
        view.setTitle(tr('Add image from URL'));
        view.down('form').loadRecord(record);
    },

    addImageFile: function() {
        var record = Ext.create(this.getImageModel(), { file: '', description: '' });
        var view = Ext.widget('teeditimagefile');
        view.setTitle(tr('Add image file'));
        view.down('filefield').allowBlank = false;
        view.down('form').loadRecord(record);
    },

    editImage: function() {
        var record = this.selectedImage();
        var isFile = (record.get('file').indexOf('://') === -1);
        var view = Ext.widget(isFile ? 'teeditimagefile' : 'teeditimageurl');
        view.down('form').loadRecord(record);
    },

    saveImageUrl: function(button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            store = this.getImagesStore();
        win.close();

        // Basic validation
        if (values.file.trim() === '')
            return;
        record.set(values);
        if (record.get('id') === undefined)
            store.add(record);
        store.sync();
    },

    uploadImage: function(button) {
        var win = button.up('window'),
            formp = win.down('form'),
            record = formp.getRecord(),
            values = formp.getValues(),
            form = formp.getForm(),
            store = this.getImagesStore();

        if (!form.isValid())
            return;

        if (formp.down('filefield').getValue().length !== 0) {
            form.submit({
                url: '/image-upload',
                success: function(form, action) {
                    win.close();
                    record.set(values);
                    record.set('file', action.result.file);
                    if (record.get('id') === undefined)
                        store.add(record);
                    store.sync();
                },
                failure: function(form, action) {
                    Ext.Msg.alert(tr('Upload failed'), action.result.msg);
                }
            });
        } else {
            win.close();
            record.set(values);
            store.sync();
        }
    },

    chooseImage: function(button) {
        var win = button.findParentByType('teimagelibrary'),
            field = win.targetField,
            image = this.selectedImage();
        field.setValue(image.get('file'));
        win.close();
        this.application.getController('PageControllerBase').updatePage();
    },

    setStatus: function(msg) {
        console.log('STATUS', msg);
        this.getStatusText().setText(msg);
        Ext.defer(function() {
            var tbtext = this.getStatusText();
            if (tbtext)
                tbtext.setText('&nbsp;');
        }, 2000, this);
    },

    savePage: function() {
        if (!this.pagectrl)
            return;
        this.pagectrl.updatePage();
    }
});
