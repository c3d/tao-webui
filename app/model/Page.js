Ext.define('TE.model.Page', {
	extend: 'Ext.data.Model',
	fields: [ 'id', 'name', 'ptclass' ],
	belongsTo: 'TE.model.Document'
})
