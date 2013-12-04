Ext.define('TE.util.CustomGridEditor', {
    extend:'Ext.grid.Panel',
    alias: 'widget.customgrideditor',
    border: false,
    multiSelect : true,
    verticalScrollerType: 'paginggridscroller',
    invalidateScrollerOnRefresh: false,
    viewConfig:{
        markDirty:false
    },
    selType: 'cellmodel',
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2,
        pluginId: 'cellEditing',
        listeners: {
            edit: function() {
                var grid  = Ext.getCmp('chartgrid');
                var store = grid.getStore();
                var data = [];
                store.each(function(r){
                    data.push(r.data);
                });
                var jsonData = Ext.encode(data);
                var chartdata  = Ext.getCmp('chartdata');
                chartdata.setValue(jsonData);
            }
        }
    })],
    tbar: [{
        itemId: 'addRow',
        text: 'Add',
        handler : function() {
            var grid  = Ext.getCmp('chartgrid');
            var store = grid.store;
            var cellEditing = grid.getPlugin('cellEditing');
            var newRow = store.getCount();

            cellEditing.cancelEdit();
            store.add({"c":"", "b":"", 'c':'', 'd':''})
            cellEditing.startEdit(newRow, 0);
        }
    }, {
        itemId: 'removeRow',
        text: 'Remove',
        handler: function() {
            var grid  = Ext.getCmp('chartgrid');
            var store = grid.store;
            var cellEditing = grid.getPlugin('cellEditing');
            var sm = grid.getSelectionModel();

            cellEditing.cancelEdit();
            store.remove(sm.getSelection());
            if (store.getCount() > 0) {
                sm.select(0);
            }

            var data = [];
            store.each(function(r){
                data.push(r.data);
            });
            var jsonData = Ext.encode(data);
            var chartdata  = Ext.getCmp('chartdata');
            chartdata.setValue(jsonData);

            // Force grid refresh to update row numbers
            grid.getView().refresh(true);
        },
    }]
});