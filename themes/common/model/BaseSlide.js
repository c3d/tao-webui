Ext.define('TE.themes.common.model.BaseSlide', {
    extend: 'TE.model.Page',
    requires: [
        'TE.util.CustomHtmlEditor',
        'TE.util.CustomChartEditor',
        'TE.util.CustomDynamicFields'],
    fields: [
        { name: 'dynamicfields', type: 'hiddenfield'},
    ]
})
