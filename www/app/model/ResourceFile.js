Ext.define('TE.model.ResourceFile', {
	extend: 'Ext.data.Model',
	fields: [ 
            // Text. May contain either:
            //  - a full URL (containing ://)
            //  - a relative file name (relative to the Tao document)
            // The value is used as-is in the generated document, but the
            // editor may possibly go through the server to access the file
            // or get a suitable image representation, depending on the type.
            'file',

            // 'image' or 'movie'
            { name: 'type', type:'string', defaultValue: 'image' },
            'description'
        ],

    proxy: {
        type: 'rest',
        url: 'resources',
        reader: {
            type: 'json',
            root: 'resources'
        },
        // Do not send ?page=...&start=...&limit=...
        pageParam: undefined,
        startParam: undefined,
        limitParam: undefined
    }
})
