Ext.define('TE.themes.common.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.common.model.MainTitleSlide',
        'TE.themes.common.model.SectionSlide',
        'TE.themes.common.model.BaseSlide',

        'TE.themes.common.view.properties.MainTitleSlide',
        'TE.themes.common.view.properties.SectionSlide',
        'TE.themes.common.view.properties.BaseSlide'
    ]
});
