Ext.define('TE.view.PageList', {
    extend: 'Ext.grid.Panel',
    requires: [ 'TE.view.PageListContextMenu' ],
    alias: 'widget.pagelist',

    title: 'Pages',
    store: 'Pages',

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
    }]
});
