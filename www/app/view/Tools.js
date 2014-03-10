Ext.define('TE.view.Tools', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tools',

    title: tr('Tools'),

    layout: { type: 'vbox', align: 'stretch' },

    items: [
        {
    	    title: tr('Themes'),
            xtype: 'treepanel',
            itemId: 'themepanel',
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
                        return Ext.String.format('<div class="slide-template"><img src="themes/{0}.pt.png"/><br/>{1}</div>', data.model, value);
                    return value;
                }
            }],

            setStore: function (store) {
                this.reconfigure(store);
            }
        },
        {
            xtype: 'pagelist',
            autoScroll: true,
            collapsible: true,
            flex: 1
        }
    ]
 });
