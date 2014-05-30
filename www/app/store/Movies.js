Ext.define('TE.store.Movies', {
	extend: 'Ext.data.Store',

    autoLoad: true,
    model: 'TE.model.ResourceFile',

    filters: [
        function(item) {
            return item.get('type') === 'movie';
        }
    ]
})
