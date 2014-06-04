// ****************************************************************************
//  CustomBodies.js                                                Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Custom bodies for the optional elements in a template
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

Ext.define('TE.util.CustomBodies', {
// ----------------------------------------------------------------------------
//   A dynamic field holding all the properties for a slide
// ----------------------------------------------------------------------------
    extend:'Ext.form.FieldContainer',
    alias: 'widget.te_custombodies',
    name:"bodies",
    layout: 'vbox',
    items: [{
        xtype: 'hiddenfield',
        name:'bodies',
        flex: 1,
        listeners: {
            change: function()
            {
                // Parse JSON only when container is loaded
                // (i.e no other fields)
                if(this.ownerCt.items.length == 1)
                {
                    console.log('parseJSON: ', this.getValue());
                    this.ownerCt.parseJSON(this.getValue());
                }
            }
        }
    }, {
    	title: tr('Items'),
        xtype: 'treepanel',
        itemId: 'itemspanel',
        collapsible: true,
        flex: 1,
        autoScroll: true,
        rootVisible: false,
        singleExpand: true,
        lines: false,
        useArrows: true,
        hideHeaders: true,
        columns: [{
            xtype : 'treecolumn',
            dataIndex : 'text',
            width: '100%',
            renderer : function(value, record){
                var data = record.record.raw;
                if (data.leaf)
                    return Ext.String.format('<div class="item-template"><img src="themes/{0}.page.png"/><br/>{1}</div>', data.model, value);
                return value;
            }
        }],
        
        setStore: function (store) {
            this.reconfigure(store);
        }
    }],
    listeners:
    {
        remove: function(me, field) { this.removeField(field); }
    },
    disableSave: false,
    extraSaveData: {},


    render: function()
    // ------------------------------------------------------------------------
    //   When rendering, load the possible choices from the server
    // ------------------------------------------------------------------------
    {
        var itemsPanel = this.down('treepanel');
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

        var kindsArray = this.getValue().split(' ');
        var me = this;
        kindsArray.forEach(function(itemKind) {
            var itemsArray = JSON.parse(Tao.httpGet("/list/" + itemKind));
            Ext.each(themeArray, loadThemeFromModel, this);
        });
                           
        var store = Ext.create('Ext.data.TreeStore', { root: dataRoot });
        themePanel.setStore(store);
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Render item as JSON to save on the server side
    // ------------------------------------------------------------------------
    {
        console.log("CustomBodies::toJSON");
        return '{}';
    },


    fromJSON: function(json)
    // ------------------------------------------------------------------------
    //   Render item as JSON to save on the server side
    // ------------------------------------------------------------------------
    {
        console.log("CustomBodies::fromJSON", json);
    },

    setValue: function(json)
    // ------------------------------------------------------------------------
    //   Set the value of the field
    // ------------------------------------------------------------------------
    {
        console.log('Bodies::setValue ', json);
        return this.fromJSON(json);
    },

    getValue: function()
    // ------------------------------------------------------------------------
    //   Set the value of the field
    // ------------------------------------------------------------------------
    {
        console.log('Bodies::setValue ', json);
        return this.toJSON();
    }
});
