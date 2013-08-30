Ext.define('TE.view.PageList', {
    extend: 'Ext.grid.Panel',
    requires: [ 'TE.view.PageListContextMenu' ],
    alias: 'widget.pagelist',

    title: 'Pages',
    store: 'Pages',

    columns: [{
        text: tr('Page #'),
        xtype: 'rownumberer',
        width: 50,
        sortable: false
    },{
        text: '',
        dataIndex: 'kind',
        renderer: function(v, meta, rec, rowIndex) {
            var img = Ext.create(rec.getPageTemplateViewClass()).image;
            return '<img src="' + img + '" />';
        }
    },{
        text: tr('Page name'),
        flex: 1,
        dataIndex: 'name',
        sortable: false
    }]
});
