Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',
    requires: [ 'Ext.window.MessageBox' ],

    stores: [ 'Pages', 'Images', 'Videos' ],
    models: [ 'Page', 'ResourceFile' ],
    views: [
        'Editor',
        'EditResourceFile',
        'EditResourceURL',
        'ImagePickerField',
        'VideoPickerField',
        'PageList',
        'PageListContextMenu',
        'PageTemplateContextMenu',
        'Properties',
        'ResourceLibrary',
        'Tools'
    ],
    refs: [
        // Make components accessible through this.getCenterpane(), this.getTools(), etc.
        { ref: 'centerpane', selector: '#centerpane' },
        { ref: 'properties', selector: '#properties' },
        { ref: 'tools', selector: '#tools' },
        { ref: 'pagelist', selector: 'pagelist' },
        { ref: 'themePanel', selector: '#themepanel' },
        { ref: 'pageContextMenu', selector: 'pagelistcontextmenu', xtype: 'pagelistcontextmenu', autoCreate: true },
        { ref: 'pageTemplateContextMenu', selector: 'pagetemplatecontextmenu', xtype: 'pagetemplatecontextmenu', autoCreate: true },
        { ref: 'pageMoveBeforeBtn', selector: 'pagelist button[action=pageBefore]' },
        { ref: 'pageMoveAfterBtn', selector: 'pagelist button[action=pageAfter]' },
        { ref: 'pageDeleteBtn', selector: 'pagelist button[action=pageDelete]' },
        { ref: 'resourceLibrary', selector: 'teresourcelibrary' },
        { ref: 'resourceLibraryGrid', selector: 'teresourcelibrary gridpanel' },
        { ref: 'resourceDeleteBtn', selector: 'teresourcelibrary button[action=delete]' },
        { ref: 'resourceEditBtn', selector: 'teresourcelibrary button[action=edit]' },
        { ref: 'resourceChooseBtn', selector: 'teresourcelibrary button[action=choose]' },
        { ref: 'statusText', selector: 'toolbar #statustext'}
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
            'pagelist dataview': {
            	itemclick: this.pageClicked,
                itemcontextmenu: this.showPageContextMenu,
                beforedrop: this.dragAndDropPages
            },
            'te_displayfield': {
                click: this.displayFieldClicked,
                removed: this.displayFieldRemoved
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
            'editor [action=addField]': {
                 click: this.addField
             },
            'button[action=showPicLibrary]': {
                click: this.showImageLibrary
            },
            'button[action=showVidLibrary]': {
                click: this.showVideoLibrary
            },
            'teresourcelibrary gridpanel': {
                select: this._updateresourcelibraryButtons,
                itemdblclick: this.editResource
            },
            'teresourcelibrary button[action=delete]': {
                click: this.deleteResource
            },
            'teresourcelibrary button[action=addUrl]': {
                click: this.addResourceUrl
            },
            'teresourcelibrary button[action=addFile]': {
                click: this.addResourceFile
            },
            'teresourcelibrary button[action=choose]': {
                click: this.chooseResource
            },
            'teresourcelibrary button[action=edit]': {
                click: this.editResource
            },
            'teeditresourceurl button[action=save]': {
                click: this.saveResourceUrl
            },
            'teeditresourcefile button[action=upload]': {
                click: this.uploadResource
            },
            '#centerpane button[action=savepage]': {
                click: this.savePage
            },
            '#centerpane': {
                saving: function() {
                    this.setStatus(tr('Saving...'));
                },
                saved: function() {
                    this.setStatus(tr('Saved'));
                }
            },
            'customhtmleditor': {
                savecurrentpage: function() {
                    this.savePage();
                }
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

        // Install a global event handler for Ctrl-S.
        // Note: the shortcut applies everywhere BUT in the HTML editor, which already catches
        // Ctrl-S and thus has a special treatment (the view will fire 'savecurrentpage')
        var me = this;
        Ext.getDoc().on('keydown', function(event, target) {
            if (event.ctrlKey && !event.shiftKey && event.getKey() == event.S) {
                event.stopEvent();
                me.savePage();
            }
        });
    },

    loadThemes: function() {
        var themePanel = this.getThemePanel();

        // Loading modern themes
        function httpGet(theUrl)
        {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", theUrl, false );
            xmlHttp.send( null );
            return xmlHttp.responseText;
        }

        function loadThemeFromPath(theme) {
            var trans = TE.i18n.Translate;
            try {
                var panel = Ext.create('TE.themes.common.view.Theme', {
                    image: 'app/themes/' + theme.theme + '.theme.png',
                    caption: theme.theme,
                    path: theme.theme,
                    pageTemplates: theme.templates
                });
                themePanel.add(panel);
            } catch(e) {
                console.log('Warning: unable to load theme: ' + theme);
                console.log(e);
            }
        }

        // Loading legacy themes
        function load(theme) {
            try {
                var panel = Ext.create('TE.themes.' + theme + '.view.Theme');
                themePanel.add(panel);
            } catch (e) {
                console.log('Warning: failed to load theme: ' + theme);
                console.log(e);
            }
        }

        Ext.each([
            'blueclaire',
            'keyboard',
            'autumn_on_earth',
            //'greenclaire',  // Uncomment this one to check the 'remote theme' feature at Taodyne (=> nano.local)
            'seyes',
            'pastel_triangles',
            'bright_rectangles',
            'seasons_greetings',
            'lucky_stars',
            'water',
            'finance',
            'landscapes',
            'black_white'
            ], load, this);

        var themeArray = JSON.parse(httpGet("/theme-list"));
        Ext.each(themeArray, loadThemeFromPath, this);

    },

    onLaunch: function() {
        var dflt = this.getThemePanel().items.items[0];
        this.themeClicked(dflt);
    },

    themeClicked: function(theme) {
        this.savePage();
        this.getTools().setPageTemplates(theme.getPageTemplatesPanel());

        Ext.each(Ext.ComponentQuery.query('theme'), function(child) {
            child.toggleCurrentTheme(child === theme);
            child.toggleSelected(child === theme);
        });
        Ext.each(Ext.ComponentQuery.query('pagetemplate'), function(child) {
            child.toggleSelected(false);
        })
        this.getThemePanel().collapse(Ext.Component.DIRECTION_TOP, true);
    },

    pageTemplateClicked: function(pt) {
        this.savePage();
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'),
                 function(child) {
                     child.toggleSelected(child === pt);
                 });
    },

    pageClicked: function(grid, record) {
        this.savePage();
        Ext.each(Ext.ComponentQuery.query('theme, pagetemplate'),
                 function(child) {
                     child.toggleSelected(false);
                 });

        if (this.pagectrl)
            this.pagectrl.endDisplay();

        console.log('Record');
        console.log(record);
        console.log('Grid');
        console.log(grid);

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

    displayFieldClicked: function(displayField) {
        var cp = this.getCenterpane();
        cp.removeAll();
        var view = Ext.create('TE.util.CustomHtmlEditor', {
            name: displayField.name,
            value: displayField.getValue(),
            layout: 'fit',
            sourceField: displayField
        });
        cp.add(view);
        view.withEd(function() {
            var editor = view.getEditor();
            editor.onChange.add(function (ed, change) {
                displayField.setValue(change.content);
            });
            editor.onEvent.add(function(ed, event) {
                displayField.setValue(editor.getContent());
            });
        });
    },

    displayFieldRemoved: function(displayField) {
        var cp = this.getCenterpane();
        var view = cp.items.items[0]; // Get view
        if(view)
        {
            // Remove view from center pane if field has been deleted
            if(view.name == displayField.name)
                cp.removeAll();
        }
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

    showPageContextMenu: function(page, record, item, index, e, eOpts) {
    	model = page.getSelectionModel();
    	model.select(record); // Force selection of item rightclicked
        e.stopEvent();
        var menu = this.getPageContextMenu();
        var last = this.getPagesStore().count() - 1;
        menu.getComponent('ctx-menu-move-page-before').setDisabled(index === 0);
        menu.getComponent('ctx-menu-move-page-after').setDisabled(index === last);
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
                    tr('Are you sure you want to delete this page?') + '[' + pageId + '] ' + page.get('name'),
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
        var selectedPage = this.selectedPage();

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

        if (selectedPage) {
            var pageId = selectedPage.get('id');
            var rowIndex = this.getPagesStore().find('id', pageId);
            page.set('idx', rowIndex + 1);
        }
        store.add(page);
        store.sync();
        if (selectedPage) {
            store.reload();
        }
    },

    selectedPage: function() {
    	return this.pagesList().getSelectionModel().getSelection()[0];
    },

    pagesList: function() {
    	return Ext.ComponentQuery.query('dataview')[0];
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
        exactmodel.load(id, {
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

    dragAndDropPages: function(node, data, dropRec, dropPosition) {
        var record = this.selectedPage();
        var id = record.get('id');
        var store = this.getPagesStore();
        var index = store.find('id', id);

        var newId = dropRec.get('id');
        var newIndex = store.find('id', newId);

        var delta = newIndex - index;
        this.movePage(delta);
    },

    addField: function(e) {
        var dynamic = Ext.getCmp('dynamic');
        if(dynamic)
            dynamic.addField(e.id, e.text);
    },


    showImageLibrary: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Image library'),
            store: 'Images',
            type: 'image'
        });
    },

    showVideoLibrary: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Video library'),
            store: 'Videos',
            type: 'video'
        });
    },

    selectedResource: function() {
        return this.getResourceLibraryGrid().getSelectionModel().getSelection()[0];
    },

    deleteResource: function() {
        var me = this;
        var resource = this.selectedResource();

        var box = Ext.create(Ext.window.MessageBox);
        var thing = resource.get('type');
        var title = tr('Delete ' + thing);
        var msg = tr('Are you sure you want to delete this ' + thing  + '?')
        box.confirm(title,
                    msg + '<br><br>' + resource.get('description'),
                    function(button) {
                        if (button === 'yes') {
                            var store = me.getImagesStore();
                            store.remove(resource);
                            store.sync();
                            me._updateresourcelibraryButtons();
                        }
                    });
    },

    _updateresourcelibraryButtons: function() {
        var disable = this.selectedResource() === undefined;
        this.getResourceDeleteBtn().setDisabled(disable);
        this.getResourceEditBtn().setDisabled(disable);
        this.getResourceChooseBtn().setDisabled(disable);
    },

    addResourceUrl: function() {
        var type = this.getResourceLibrary().type;
        var record = Ext.create(this.getResourceFileModel(),
                                { file: '', description: '', type: type });
        var view = Ext.widget('teeditresourceurl', { type: type });
        view.setTitle(tr('Add ' + type + ' from URL'));
        view.down('form').loadRecord(record);
    },

    addResourceFile: function() {
        var type = this.getResourceLibrary().type;
        var record = Ext.create(this.getResourceFileModel(),
                                { file: '', description: '', type: type });
        var view = Ext.widget('teeditresourcefile', { type: type });
        view.setTitle(tr('Add ' + type + ' file'));
        view.down('filefield').allowBlank = false;
        view.down('form').loadRecord(record);
    },

    editResource: function() {
        var record = this.selectedResource();
        var isFile = (record.get('file').indexOf('://') === -1);
        var view = Ext.widget(isFile ? 'teeditresourcefile' : 'teeditresourceurl',
                              { type: record.get('type') });
        view.down('form').loadRecord(record);
    },

    saveResourceUrl: function(button) {
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

    getStoreForResource: function(type) {
        switch (type) {
            case 'image':
                return this.getImagesStore();
            case 'video':
                return this.getVideosStore();
        }
        return null;
    },

    uploadResource: function(button) {
        var win = button.up('window'),
            formp = win.down('form'),
            record = formp.getRecord(),
            values = formp.getValues(),
            form = formp.getForm(),
            type = record.get('type'),
            store = this.getStoreForResource(type);

        if (!form.isValid())
            return;

        if (formp.down('filefield').getValue().length !== 0) {
            form.submit({
                url: '/' + type + '-upload',
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

    chooseResource: function(button) {
        var win = button.findParentByType('teresourcelibrary'),
            field = win.targetField,
            image = this.selectedResource();
        field.setValue(image.get('file'));
        win.close();
        this.application.getController('PageControllerBase').updatePage();
    },

    setStatus: function(msg) {
        this.getStatusText().setText(msg);
        Ext.defer(function() {
            var tbtext = this.getStatusText();
            if (tbtext)
                tbtext.setText('&nbsp;');
        }, 2000, this);
    },

    // Send current page to server (if modified)
    savePage: function() {
        if (!this.pagectrl)
            return;
        this.pagectrl.updatePage();
    }
});
