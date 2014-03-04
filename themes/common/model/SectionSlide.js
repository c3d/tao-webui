Ext.define('TE.themes.common.model.SectionSlide', {
    extend: 'TE.model.Page',
    fields: [
        'title',
        'subtitle',
        { name: 'dynamicfields', type: 'hiddenfield'},
    ]
})
