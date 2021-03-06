// ****************************************************************************
//  Items.js                                                      Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Additional entries for the optional recursive elements in a template
//     (elements marked with '[[items "toto"]]' in the .DDT file
//
//     This converts a recursive data model (i.e. the JSON files) into 
//     a non-recursive one (the components) as implemented by the
//     DynamicFields.js class
// 
// 
// 
// ****************************************************************************
//  (C) 2014 Christophe de Dinechin <christophe@taodyne.com>
//  (C) 2014 Jérôme Forissier <jerome@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

Ext.define('TE.util.Items', {
// ----------------------------------------------------------------------------
//   A dynamic field holding all the properties for a slide
// ----------------------------------------------------------------------------
    extend: 'Ext.form.FieldSet',
    alias: 'widget.te_items',
    layout: 'vbox',
    collapsible: true,
    extraSaveData: {},

    items: [{
        xtype: 'treepanel',
        rootVisible: false,
        singleExpand: true,
        lines: false,
        useArrows: true,
        hideHeaders: true,
        width: '100%',
        height: 100,
        padding: '0 0 10 0',
        columns: [{
            xtype : 'treecolumn',
            dataIndex : 'text',
            width: '100%',
            renderer : function(value, record){
                var data = record.record.raw;
                if (data.leaf)
                    return Ext.String.format('<div class="item-template"><img src="{0}"/>{1}</div>', data.preview, value);
                return value;
            }
        }],

        listeners: {
            itemdblclick : function(view,rec,item,indexa,eventObj,eventOpts) {
                var model = rec.raw.model;
                var init = httpGet('/init/' + model);
                if (init) {
                    var dynamic = Ext.getCmp('dynamic');
                    var items = view.up('te_items');
                    var name = rec.raw.text;
                    init = JSON.parse(init);
                    init._model_ = model;
                    var fieldValue = { _labels_: { item: name }, item : init };
                    var field = dynamic.addItem(fieldValue, items);
                }
            },
            itemclick : function(view,rec,item,indexa,eventObj,eventOpts) {
                var model = rec.raw.model;
                if (model)
                {
                    var name = rec.raw.text;
                    var url = 'themes/' + rec.raw.fullName + '.html';
                    var ed = TE.app.getController('TE.controller.Editor');
                    ed.setCenterPaneURL(model, name, url, null);
                }
            }
        },
        
        setStore: function (store) {
            this.reconfigure(store);
        }
    }],


    loadTreePanel: function(kinds)
    // ------------------------------------------------------------------------
    //   When rendering, load the possible choices from the server
    // ------------------------------------------------------------------------
    {
        var itemsPanel = this.down('treepanel');
        var dataRoot = { expanded: true, children: [] };
        var currentKind = undefined;

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
                                model: subdir, fullName : subdir + '/' + dir,
                                children: [] });
                    len = kids.length;
                }
                return add(kids[len-1], rest, subdir, templates);
            }
            templates.forEach(function (pt) {
                var last = pt.lastIndexOf('/');
                var caption = pt.substr(last+1);
                var fullName = pt + '.' + currentKind;
                var pview = '/themes/' + fullName + '.png';
                kids.push({ text: caption, leaf: true,
                            iconCls: 'no-icon',
                            model: pt,
                            fullName: fullName,
                            preview: pview });
            });
        }
        
        function loadThemeFromModel(theme)
        {
            add(dataRoot, theme.theme, '', theme.templates);
        }

        var kindsArray = kinds.split(' ');
        var me = this;
        kindsArray.forEach(function(itemKind) {
            var itemsArray = JSON.parse(httpGet("/list/" + itemKind));
            currentKind = itemKind;
            Ext.each(itemsArray, loadThemeFromModel, this);
        });
                           
        var store = Ext.create('Ext.data.TreeStore', { root: dataRoot });
        itemsPanel.setStore(store);
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Render item as JSON to save on the server side
    // ------------------------------------------------------------------------
    {
        var dynamic = Ext.getCmp('dynamic');
        return dynamic.toJSONItems(this);
    },


    fromJSON: function(json)
    // ------------------------------------------------------------------------
    //   Render item as JSON to save on the server side
    // ------------------------------------------------------------------------
    {
        var obj = json;
        if (typeof obj == 'string')
            obj = JSON.parse(obj);
        this.loadTreePanel(obj._kinds_);

        var dynamic = Ext.getCmp('dynamic');
        this.extraSaveData = {};
        dynamic.addItem(obj, this);
    },


    setValue: function(json)
    // ------------------------------------------------------------------------
    //   Set the value of the field
    // ------------------------------------------------------------------------
    {
        return this.fromJSON(json);
    },


    getValue: function()
    // ------------------------------------------------------------------------
    //   Set the value of the field
    // ------------------------------------------------------------------------
    {
        return this.toJSON();
    }
});
