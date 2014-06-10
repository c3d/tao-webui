// ****************************************************************************
//  Items.js                                                      Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Additional entries for the optional elements in a template
//     (elements marked with '[[body "toto"]]' in the .DDT file
// 
// 
// 
// 
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
    requires:['Ext.slider.Single'],
    alias: 'widget.te_items',
    layout: 'vbox',
    item_kinds: '',

    items: [{
        xtype: 'hiddenfield',
        name:'items',
        flex: 1,
        listeners: {
            change: function()
            {
                // Parse JSON only when container is loaded
                // (i.e no other fields)
                if(this.ownerCt.items.length == 1)
                {
                    this.ownerCt.parseJSON(this.getValue());
                }
            }
        }
    }, {
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
        
        setStore: function (store) {
            this.reconfigure(store);
        }
    }],


    loadItems: function(f)
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
                                path: subdir, children: [] });
                    len = kids.length;
                }
                return add(kids[len-1], rest, subdir, templates);
            }
            templates.forEach(function (pt) {
                var last = pt.lastIndexOf('/');
                var caption = pt.substr(last+1);
                var pview = '/themes/' + pt + '.' + currentKind + '.png';
                kids.push({ text: caption, leaf: true,
                            iconCls: 'no-icon',
                            model: pt,
                            preview: pview });
            });
        }
        
        function loadThemeFromModel(theme)
        {
            add(dataRoot, theme.theme, '', theme.templates);
        }

        var kindsArray = this.getValue().split(' ');
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
        return this.item_kinds;
    },


    fromJSON: function(json)
    // ------------------------------------------------------------------------
    //   Render item as JSON to save on the server side
    // ------------------------------------------------------------------------
    {
        this.item_kinds = json;
        this.loadItems();
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
