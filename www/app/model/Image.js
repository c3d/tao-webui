Ext.define('TE.model.Image', {
    extend: 'Ext.data.Model',
    fields: [ 
        // Text. May contain either:
        //  - a full URL (containing ://), in which case the URL is used
        // as-is by the editor and also in the Tao document,
        // - a relative file name, used as-is in the generated Tao document but
        // not by the editor which will build a URL using a common convention
        // with the server (e.g.: 'file.png' => '/imagelibrary/file.png')
        'file',
        'description'
    ],

    proxy: {
        type: 'rest',
        url: 'images',
        reader: {
            type: 'json',
            root: 'images'
        },
        // Do not send ?page=...&start=...&limit=...
        pageParam: undefined,
        startParam: undefined,
        limitParam: undefined
    }
})
