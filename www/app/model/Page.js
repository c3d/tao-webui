Ext.define('TE.model.Page', {
	extend: 'Ext.data.Model',
	fields: [ 'name', 'ptclass' ],

    proxy: {
        type: 'ajax',
        url: 'rest/pages',
        reader: {
            type: 'json',
            root: 'pages'
        }
    }
})
