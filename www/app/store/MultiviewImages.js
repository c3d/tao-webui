Ext.define('TE.store.MultiviewImages', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    model: 'TE.model.ResourceFile',

    filters: [
        function(item) {
            return item.get('type') === 'mvimage';
        }
    ]
})
