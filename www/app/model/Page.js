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

    // Example: if kind = vellum.TitleAndSubtitle, returns 'vellum'
    theme: function() {
        var kind = this.get('kind');
        var dot = kind.indexOf('.');
        return kind.substring(0, dot);
    },

    template: function() {
        var kind = this.get('kind');
        var dot = kind.indexOf('.');
        return kind.substring(dot + 1);
    },

    // Example: if kind = vellum.TitleAndSubtitle, returns 'TE.themes.vellum.view.TitleAndSubtitle'
    getPageTemplateViewClass: function() {
        return 'TE.themes.' + this.theme() + '.view.' + this.template();
    },

    // Example: if kind = vellum.TitleAndSubtitle, returns 'TE.themes.vellum.view.properties.TitleAndSubtitle'
    getPropertiesViewClass: function() {
        return 'TE.themes.' + this.theme() + '.view.properties.' + this.template();
    },

    // Example: if kind = vellum.TitleAndSubtitle, returns 'TE.themes.vellum.model.TitleAndSubtitle'
    getModelClassName: function() {
        return 'TE.themes.' + this.theme() + '.model.' + this.template();
    },

    // Example: if kind = 'vellum.AnyThing', returns 'TE.themes.vellum.controller.Controller'
    getControllerName: function() {
        return 'TE.themes.' + this.theme() + '.controller.Controller';
    }

})
