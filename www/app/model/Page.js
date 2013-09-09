Ext.define('TE.model.Page', {
	extend: 'Ext.data.Model',
	fields: [ 'name', 'kind', { name: 'idx', type: 'int', defaultValue: -1 }  ],

    proxy: {
        type: 'rest',
        url: 'pages',
        reader: {
            type: 'json',
            root: 'pages'
        },
        // Do not send ?page=...&start=...&limit=...
        pageParam: undefined,
        startParam: undefined,
        limitParam: undefined
    },

    // Example: if kind = vellum.TitleAndSubtitle, returns 'TE.view.vellum.TitleAndSubtitle'
    getPageTemplateViewClass: function() {
        return 'TE.view.' + this.get('kind');
    },

    // Example: if kind = vellum.TitleAndSubtitle, returns 'TE.view.properties.vellum.TitleAndSubtitle'
    getPropertiesViewClass: function() {
        return 'TE.view.properties.' + this.get('kind');
    },

    // Example: if kind = vellum.TitleAndSubtitle, returns 'TE.model.vellum.TitleAndSubtitle'
    getModelClassName: function() {
        return 'TE.model.' + this.get('kind');
    },

    // Example: if kind = 'vellum.AnyThing', returns 'vellum.Controller'
    getControllerName: function() {
        var kind = this.get('kind');
        var dot = kind.indexOf('.');
        var theme = kind.substring(0, dot);
        return theme + '.Controller';
    }

})
