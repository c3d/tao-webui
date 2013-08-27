Ext.define('TE.model.Page', {
	extend: 'Ext.data.Model',
	fields: [ 'name', 'ptclass' ],

    proxy: {
        type: 'rest',
        url: 'rest/pages',
        reader: {
            type: 'json',
            root: 'pages'
        },
        // Do not send ?page=...&start=...&limit=...
        pageParam: undefined,
        startParam: undefined,
        limitParam: undefined
    }
})
