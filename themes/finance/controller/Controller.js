Ext.define('TE.themes.finance.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.finance.model.MainTitleSlide',
        'TE.themes.finance.model.SectionSlide',
        'TE.themes.finance.model.BaseSlide',

        'TE.themes.finance.view.properties.MainTitleSlide',
        'TE.themes.finance.view.properties.SectionSlide',
        'TE.themes.finance.view.properties.BaseSlide'
    ]
});
