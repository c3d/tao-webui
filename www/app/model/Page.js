Ext.define('TE.model.Page', {
    extend: 'Ext.data.Model',
    requires: [ 'TE.util.ServerErrors' ],
    fields: [
        'name',
        'kind',
        'path',
        { name: 'idx', type: 'int', defaultValue: -1 }
    ],

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
        limitParam: undefined,
        listeners: {
            exception: function (proxy, req, op) {
                // Handle save/sync error from server
                var msg;
                if (req.status !== 200)
                    msg = tr('HTTP error: ') + req.status + ' ' + req.statusText;
                else
                    msg = TE.util.ServerErrors.message(op.request.scope.reader.jsonData);
                Ext.Msg.show({
                    title: tr('Error'),
                    msg: msg,
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.MessageBox.OKCANCEL,
                    buttonText: {
                        ok: tr('Overwrite'),
                        cancel: tr('Cancel')
                    },
                    defaultFocus: 'cancel',
                    fn: function(id) {
                        if (id === 'ok') {
                            op.params = op.params || {};
                            op.params.overwrite = 1;
                            proxy.read(op); // Retry
                        }
                    }
                });
            }
        }
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
        var path = this.get('path');
        if (path && path.length > 0)
            return 'TE.themes.common.model.' + this.template();
        return 'TE.themes.' + this.theme() + '.model.' + this.template();
    },

    // Example: if kind = 'vellum.AnyThing', returns 'TE.themes.vellum.controller.Controller'
    getControllerName: function() {
        var path = this.get('path');
        if (path && path.length > 0)
            return 'TE.controller.PageControllerBase';
        return 'TE.themes.' + this.theme() + '.controller.Controller';
    }

})
