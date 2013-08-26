Ext.define('TE.view.PageList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pagelist',

    title: 'Pages',
    store: 'Pages',

    autoScroll: true,
    layout: {
        type: 'hbox',
        align: 'center',
        defaultMargins: 5
    }
});
