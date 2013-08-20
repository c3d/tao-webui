Ext.define('TE.view.PageList', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pagelist',

    title: 'Pages',

    initComponent: function() {
        console.log('view.PageList initComponent');
        this.callParent(arguments);
     }
 });