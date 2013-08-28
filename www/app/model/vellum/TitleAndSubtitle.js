Ext.define('TE.model.vellum.TitleAndSubtitle', {
	extend: 'TE.model.Page',
    fields: [ 
        {name: 'properties~title', mapping: 'properties.title', persist: false },
        {name: 'properties~subtitle', mapping: 'properties.subtitle', persist: false }
    ]
})
