Ext.define('TE.store.Videos', {
	extend: 'Ext.data.Store',

    autoLoad: true,
    model: 'TE.model.ResourceFile',

    filters: [
        function(item) {
            return item.get('type') === 'video';
        }
    ]
})
