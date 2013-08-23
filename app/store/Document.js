Ext.define('TE.store.Document', {
	extend: 'Ext.data.Store',

    autoLoad: true,
    model: 'TE.model.Document',
    proxy: {
        type: 'ajax',
        url: 'data/document.json',
        reader: {
            type: 'json',
            root: 'documents'
        }
    }
})
