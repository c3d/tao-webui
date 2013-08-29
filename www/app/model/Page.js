Ext.define('TE.model.Page', {
	extend: 'Ext.data.Model',
	fields: [ 'name', 'kind', 'properties' ],

    proxy: {
        type: 'rest',
        url: 'rest/pages',
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

    // Example: if kind = 'vellum.AnyThing', returns 'vellum.Vellum'
    getControllerName: function() {
        var kind = this.get('kind');
        var dot = kind.indexOf('.');
        var theme = kind.substring(0, dot);
        var cls = theme;
        cls = cls[0].toUpperCase() + cls.substring(1);
        return theme + '.' + cls;
    },

    // Ext.data.Field.mapping operates only during read.
    // This takes care of write (by copying the value of some~property into some.property)
    // http://stackoverflow.com/questions/15624966/load-and-save-nested-data-in-extjs-4
    syncTildeProperties: function() {
        var me = this;
        var data = this.getData();
        // Object.keys requires IE9 or later (http://kangax.github.io/es5-compat-table/)
        Ext.Array.forEach(Object.keys(data), function(key) {
            var tilde = key.indexOf('~');
            var left = key.substring(0, tilde);
            var right = key.substring(tilde + 1);
            if (data.hasOwnProperty(left) && data[left].hasOwnProperty(right)) {
                var obj = me.get(left);
                if (obj[right] != data[key]) {
                    obj[right] = data[key];
                    me.set(left, obj);
                    me.setDirty();  // Why is this needed?
                }
            }
        })
    },

    set: function(fieldNameOrObject, newValue) {
        this.callParent(arguments);
        this.syncTildeProperties();
    }

})
