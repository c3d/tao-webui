Ext.define('TE.model.vellum.TitleBulletsAndPhoto', {
	extend: 'TE.model.Page',
    fields: [ 
        {name: 'properties~title', mapping: 'properties.title', persist: false },
        {name: 'properties~bullets', mapping: 'properties.bullets', persist: false },
        {name: 'properties~photo', mapping: 'properties.photo', persist: false }
    ]
})
