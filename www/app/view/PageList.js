Ext.define('TE.view.PageList', {
    extend: 'Ext.grid.Panel',
    requires: [ 'TE.view.PageListContextMenu',
                'Ext.grid.plugin.DragDrop',
                'Ext.util.Point' ],
    alias: 'widget.pagelist',
    title: tr('Pages'),
    store: 'Pages',
    xtype: 'grid',
    viewConfig: {
        plugins: {
            ptype: 'gridviewdragdrop',
            dragGroup: 'list',
            dropGroup: 'list'
        }
    },
    columns: [{
        xtype: 'rownumberer',
        sortable: false
    },{
        header: '',
        dataIndex: 'kind',
        renderer: function(v, meta, rec, rowIndex) {
            var img = Ext.create(rec.getPageTemplateViewClass()).image;
            return '<img src="' + img + '" />';
        },
        sortable: false
    },{
        header: tr('Page name'),
        flex: 1,
        dataIndex: 'name',
        sortable: false
    }],

    initComponent: function() {
        Ext.apply(this, {
            tbar: [
                '->', // Right align buttons
                {
                    xtype: 'button',
                    text: tr('Move page before'),
                    icon: 'app/resources/images/page-up.gif',
                    action: 'pageBefore',
                    disabled: true
                },{
                    xtype: 'button',
                    text: tr('Move page after'),
                    icon: 'app/resources/images/page-down.gif',
                    action: 'pageAfter',
                    disabled: true
                },{
                    xtype: 'button',
                    text: tr('Delete page'),
                    icon: 'app/resources/images/delete.png',
                    action: 'pageDelete',
                    disabled: true
                },
                ' ', // Spacer
                {
                    xtype: 'button',
                    text: tr('Image library...'),
                    icon: 'app/resources/images/image.png',
                    action: 'showPicLibrary'
                }
            ]
        });

        this.callParent(arguments);
    }
});
