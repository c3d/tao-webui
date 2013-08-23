Ext.define('TE.model.Page', {
	extend: 'Ext.data.Model',
	fields: [ 'id', 'name' ],
	belongsTo: 'TE.model.Document'
})
