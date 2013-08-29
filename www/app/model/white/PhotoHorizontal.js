Ext.define('TE.model.white.PhotoHorizontal', {
	extend: 'TE.model.Page',
    fields: [ 
        {name: 'properties~caption', mapping: 'properties.caption', persist: false },
        {name: 'properties~photo', mapping: 'properties.photo', persist: false }
    ]
})
