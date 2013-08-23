Ext.define('TE.model.Document', {
	extend: 'Ext.data.Model',
	fields: [ 'id', 'name' ],
	hasMany: { model: 'TE.model.Page', name: 'pages' }
})
