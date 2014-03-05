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

    // NOTE: the following code has been largely obsoleted by the
    // new template-based mechanism (.ddt files). As a result, we always
    // work with a page.kind set to common.BaseSlide.
    // The corresponding files are now under www/app/editor, with fixed names.
    // The kind field will soon be suppressed.

    // Example: if kind = vellum.TitleAndSubtitle, returns 'vellum'
    theme: function()
    {
        var kind = this.get('kind');
        var dot = kind.indexOf('.');
        return kind.substring(0, dot);
    },

    template: function()
    {
        var kind = this.get('kind');
        var dot = kind.indexOf('.');
        return kind.substring(dot + 1);
    },

    getPageTemplateViewClass: function()
    {
        return 'TE.editor.view.BaseSlide';
    },

    getPropertiesViewClass: function()
    {
        return 'TE.editor.view.properties.BaseSlide';
    },

    getModelClassName: function()
    {
        return 'TE.editor.model.BaseSlide';
    },

    getControllerName: function()
    {
        return 'TE.controller.PageControllerBase';
    }

})
