Ext.define('TE.view.document.PageList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pagelist',

    title: 'Pages',
    store: 'Document',

    autoScroll: true,
    layout: {
        type: 'hbox',
        align: 'center',
        defaultMargins: 5
    }
});
