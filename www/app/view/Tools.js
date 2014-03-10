Ext.define('TE.view.Tools', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tools',

    title: tr('Tools'),

    layout: {
    	type: 'accordion',
    	multi: true
    },

    items: [
        {
    	    title: tr('Themes'),
            xtype: 'treepanel',
            itemId: 'themepanel',
            layout: 'vbox',
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
            layout: 'vbox'
        }
    ]
 });
