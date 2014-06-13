Ext.define('TE.tree.PageList', {
    extend: 'Ext.panel.Panel',
    requires: [ 'TE.view.PageListContextMenu',
                'TE.util.DropZone',
                'Ext.util.Point',
                "Ext.panel.Panel",
                "Ext.view.View" ],
    alias: 'widget.pagelist',
    title: tr('Pages'),
    id: 'Pages',
    layout: 'vbox',
    autoScroll: true,
    items:  [{
        xtype: 'dataview',
        alias: 'widget.page',
        title: tr('Page'),
        store: 'Pages',
        id: 'page',
        autoScroll: false,
        itemSelector: '.taopage-container',
        prepareData : function(data, recordIndex, record ){
            // Add image url to the diplayed data
            // var img = 'themes/' + record.data.model + '.page.png'
            var img = '/preview/' + record.data.id;
            data['img'] = img;
            return data;
        },
        tpl: [
            '<div class="taopage-wrap">',
            ' <tpl for=".">',
            '  <div class="taopage-container">',
            '   <div class="taopage">',
            '    <div class="taopage-img"><img src="{img}"/></div>',
            '    <div class="taopage-named">{[xindex]} - {name}</div>',
            '   </div>',
            '  </div>',
            ' </tpl>',
            '</div>'
        ],
        listeners: {
            render: function(v) {
                this.initDragZone(v);
                this.initDropZone(v);
            }
        },

        // Initialize the drag zone in the current view
        initDragZone: function(v) {
            v.dragZone = Ext.create('Ext.view.DragZone', {
                view: v,
                scroll: false,
                ddGroup: 'PageListDrag',
                dragText: 'Move page'
            });
        },

        // Initialize the drop zone in the current view
        initDropZone: function(v) {
            v.dropZone = Ext.create('Ext.view.DropZone', {
                view: v,
                ddGroup: 'PageListDrag',
                indicatorHtml: '<div class="grid-drop-indicator"></div>',
                indicatorCls: 'grid-drop-indicator',
                handleNodeDrop : function(data, record, position)
                {
                    var view = this.view;
                    var store = view.getStore();
                    var index, records, i, len;
                    data.view.store.remove(data.records, data.view === view);
                    index = store.indexOf(record);
                    if (position !== 'before') {
                        index++;
                    }
                    store.insert(index, data.records);
                    view.getSelectionModel().select(data.records);
                }
            });
        }
    }],

    initComponent: function() {
        Ext.apply(this, {
            tbar: [
                ' ',
                {
                    xtype: 'button',
                    icon: 'app/resources/images/pageUp.png',
                    action: 'pageBefore',
                    tooltip: tr('Move selected page before previous page'),
                    disabled: true
                },{
                    xtype: 'button',
                    icon: 'app/resources/images/pageDown.png',
                    action: 'pageAfter',
                    tooltip: tr('Move selected page after next page'),
                    disabled: true
                },{
                    xtype: 'button',
                    icon: 'app/resources/images/delete.png',
                    action: 'pageDelete',
                    tooltip: tr('Delete selected page'),
                    disabled: true
                },
                ' '
            ]
        });

        this.callParent(arguments);
    }
});
