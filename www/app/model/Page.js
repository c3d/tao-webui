Ext.define('TE.model.Page', {
	extend: 'Ext.data.Model',
	fields: [ 'name', 'ptclass' ],

    proxy: {
        type: 'rest',
        url: 'rest/pages',
        reader: {
            type: 'json',
            root: 'pages'
        }
    }
})
