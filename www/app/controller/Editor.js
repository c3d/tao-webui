Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.MessageBox',
        'TE.util.FileUpload',
        'TE.editor.controller.Controller'
    ],

    stores: [ 'Pages', 'Images', 'Movies', 'MultiviewImages', 'Models' ],
    models: [ 'Page', 'ResourceFile' ],
    views:
    [
        'Editor',
        'EditResourceFile',
        'EditResourceURL',
        'ImagePickerField',
        'MoviePickerField',
        'MultiviewImagePickerField',
        'PageList',
        'PageListContextMenu',
        'Properties',
        'ResourceLibrary',
        'Tools'
    ],
    refs: [
        // Make components accessible through
        // this.getCenterpane(), this.getTools(), etc.
        { ref: 'centerpane', selector: '#centerpane' },
        { ref: 'sourcepane', selector: '#sourcecode' },
        { ref: 'properties', selector: '#properties' },
        { ref: 'addMenu', selector: '#addMenu' },
        { ref: 'tools', selector: '#tools' },
        { ref: 'pagelist', selector: 'pagelist' },
        { ref: 'themePanel', selector: '#themepanel' },
        { ref: 'itemPanel', selector: '#itempanel' },
        { ref: 'pageContextMenu', selector: 'pagelistcontextmenu', xtype: 'pagelistcontextmenu', autoCreate: true },
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
                render: this.loadThemes,
                itemclick: this.pageTemplateClicked,
                itemdblclick: this.newPageFromTemplate
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
            'te_editor [action=addField]': {
                 click: this.addField
             },
            'button[action=showImageLibrary]': {
                click: this.showImageLibrary
            },
            'button[action=showMvImageLibrary]': {
                click: this.showMvImageLibrary
            },
            'button[action=showMovieLibrary]': {
                click: this.showMovieLibrary
            },
            'button[action=showModelLibrary]': {
                click: this.showModelLibrary
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
            'te_htmleditor': {
                savecurrentpage: function() {
                    this.savePage();
                }
            },
            '#sourcecode': {
                loadSource: function() {
                    var selectedPage = this.selectedPage();
                    if (selectedPage) {
                        var pageId = selectedPage.get('id');
                        var source = httpGet('/source/' + pageId);
                        var sourcePane = this.getSourcepane();
                        sourcePane.expand(true);
                        sourcePane.update('<pre><code class="xl">' +
                                          source + 
                                          '</code></pre>');
                        hljs.highlightBlock(sourcePane.body.dom);
                    }
                }
            }
        });

        // Page name validator
        // To use it: set "trackResetOnLoad: true" on form
        // and "vtype: 'pagename'" on form field
        var store = this.getPagesStore();
        Ext.apply(Ext.form.field.VTypes, {
            pagename: function(val, field) {
                if (field.originalValue === undefined ||
                    val === field.originalValue) {
                    return true;
                }
                return (store.findExact('name', val) === -1);
            },
            pagenameText: tr('This name is already used')
        });

        // Install a global event handler for Ctrl-S.
        // Note: the shortcut applies everywhere BUT in the HTML editor,
        // which already catches Ctrl-S and thus has a special treatment
        // (the view will fire 'savecurrentpage')
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
        var dataRoot = { expanded: true, children: [] };

        function add(data, path, where, templates)
        {
            var idx = path.indexOf('/');
            var kids = data.children;
            if (idx >= 0)
            {
                var dir = path.substr(0, idx);
                var rest = path.substr(idx+1);
                var len = kids.length;
                var subdir = where == '' ? dir : where + '/' + dir;
                if (len == 0 || kids[len-1].text != dir)
                {
                    kids.push({ text: dir, expanded: false,
                                path: subdir, children: [] });
                    len = kids.length;
                }
                return add(kids[len-1], rest, subdir, templates);
            }
            templates.forEach(function (pt) {
                var last = pt.lastIndexOf('/');
                var caption = pt.substr(last+1);
                kids.push({ text: caption, leaf: true, iconCls: 'no-icon',
                            model: pt });
            });
        }


        function loadThemeFromModel(theme)
        {
            add(dataRoot, theme.theme, '', theme.templates);
        }

        var themeArray = JSON.parse(httpGet("/list/page"));
        Ext.each(themeArray, loadThemeFromModel, this);

        var store = Ext.create('Ext.data.TreeStore', { root: dataRoot });
        themePanel.setStore(store);
    },

    setCenterPaneURL: function(path, text, url, defaultInfo, previewImage) {
        var themeInfo = httpGet(url);
        var theme = '/themes/' + path + '/';
        var defaultImage = '/themes/' + path + '.page.png';
        var image = previewImage || defaultImage;
        if (themeInfo == '')
        {
            themeInfo = defaultInfo;
        }
        else
        {
            var includes = themeInfo.match(/\[\[include\s+\"(.*)\"\]\]/g);
            var me = this;
            if (includes)
            {
                includes.forEach(function(incl) {
                    var file = incl.replace(/\[\[include\s+\"(.*)\"\]\]/, '$1');
                    themeInfo = themeInfo.replace(incl, httpGet(file));
                });
            }
        }

        if (themeInfo)
        {
            var cp = this.getCenterpane();
            cp.removeAll();
            var display = Ext.create('Ext.form.field.Display');
            cp.add(display);

            themeInfo = themeInfo
                .replace(/\[\[theme\]\]/g, theme)
                .replace(/\[\[image\]\]/g, image)
                .replace(/\[\[caption\]\]/g, text);
            display.update(themeInfo);
        }
    },

    pageTemplateClicked: function(list, item) {
        this.savePage();
        var pt = item.raw;
        if (pt.leaf)
            this.setCenterPaneURL(pt.model, pt.text,
                                  'themes/' + pt.model + '.page.html',
                                  '<h2>' + pt.text + ' page template</h2>' +
                                  '<img class="screenshot" src="/themes/' +
                                  pt.model + '.page.png"/>');
        else
            this.setCenterPaneURL(pt.path, pt.text,
                                  'themes/'+pt.path+'/'+ pt.text+'.theme.html',
                                  '<h2>' + pt.text + ' theme</h2>');
    },

    pageClicked: function(grid, record) {
        this.savePage();
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

        // Set a default center pane, overriden if clicksToEditing on a field
        var pt = record.data;
        this.setCenterPaneURL(pt.model, pt.name,
                              'themes/' + pt.model + '.page.html',
                              '<h2>' + pt.name + '</h2>' +
                              '<img class="screenshot" width="100%"' +
                              'src="[[image]]"/>', '/preview/' + pt.id);
    },

    displayFieldClicked: function(displayField) {
        var cp = this.getCenterpane();
        cp.removeAll();
        var view = Ext.create('TE.util.HtmlEditor', {
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
            // Remove view from center pane if field has been deleted
            if(view.name == displayField.name)
                cp.removeAll();
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

    deletePage: function() {
        var me = this;
        var store = this.getPagesStore();
        var page = this.selectedPage();
        var pageId = page.get('id');

        var box = Ext.create(Ext.window.MessageBox);
        box.confirm(tr('Delete page'),
                    Ext.String.format(tr('Are you sure you want to delete page "{0}"?'), page.get('name')),
                    function(button) {
                        if (button === 'yes') {
                            store.remove(page);
                            store.sync();
                            me._updatePageButtons();
                        }
                    });
    },

    newPageMenuItemClicked: function() {
        console.log("Not implemented yet");
    },

    newPageFromTemplate: function(list, item) {
        var pt = item.raw;
        if (pt.leaf)
        {
            var selectedPage = this.selectedPage();

            var page = Ext.create('TE.editor.model.BaseSlide');
            page.set('model', pt.model);
            var store = this.getPagesStore();
            function unusedPageName() {
                var i = 1;
                var stem = tr('Page');
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
            store.reload();

            // Select the page that was just clicked
            var pageListSelection = this.pagesList().getSelectionModel();
            pageListSelection.select(page);
            page.set('id', this.selectedPage().data.id);
            this.pageClicked(null, page);
        }
    },

    selectedPage: function() {
    	return this.pagesList().getSelectionModel().getSelection()[0];
    },

    pagesList: function() {
    	return Ext.ComponentQuery.query('dataview')[1];
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
        if (dynamic)
            dynamic.addField(e.itemId, e.text);
    },


    showImageLibrary: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Image library'),
            store: 'Images',
            storeDB: this.getImagesStore(),
            type: 'image'
        });
    },

    showMvImageLibrary: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('3D Image library'),
            store: 'MultiviewImages',
            storeDB: this.getMultiviewImagesStore(),
            type: 'mvimage'
        });
    },

    showMovieLibrary: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Movie library'),
            store: 'Movies',
            storeDB: this.getMoviesStore(),
            type: 'movie'
        });
    },

    showModelLibrary: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('3D model library'),
            store: 'Models',
            storeDB: this.getModelsStore(),
            type: 'model'
        });
    },

    selectedResource: function() {
        return this.getResourceLibraryGrid().getSelectionModel().getSelection()[0];
    },

    deleteResource: function() {
        var me = this;
        var resource = this.selectedResource();
        var type = this.getResourceLibrary().type;

        var box = Ext.create(Ext.window.MessageBox);
        var thing = resource.get('type');
        var title = tr('Delete ' + thing);
        var msg = tr('Are you sure you want to delete this ' + thing  + '?')
        box.confirm(title,
                    msg + '<br><br>' + resource.get('description'),
                    function(button) {
                        if (button === 'yes') {
                            var store = me.getStoreForResource(type);
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
        var view = Ext.widget(isFile?'teeditresourcefile':'teeditresourceurl',
                              { type: record.get('type') });
        view.down('form').loadRecord(record);
    },

    saveResourceUrl: function(button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(),
            type = this.getResourceLibrary().type,
            store = this.getStoreForResource(type);
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
            case 'image':       return this.getImagesStore();
            case 'mvimage':     return this.getMultiviewImagesStore();
            case 'movie':       return this.getMoviesStore();
            case 'model':       return this.getModelsStore();
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
