Ext.define('TE.store.Models', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'TE.model.ResourceFile',

    filters: [
        function(item) {
            return item.get('type') === 'model';
        }
    ]
})
