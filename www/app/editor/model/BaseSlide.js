Ext.define('TE.editor.model.BaseSlide', {
    extend: 'TE.model.Page',
    requires: [
        'TE.util.HtmlEditor',
        'TE.util.ChartEditor',
        'TE.util.DynamicFields'],
    fields: [
        { name: 'dynamicfields', type: 'hiddenfield'},
    ]
})
