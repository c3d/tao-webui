Ext.define('TE.themes.black_white.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.black_white.model.MainTitleSlide',
        'TE.themes.black_white.model.SectionSlide',
        'TE.themes.black_white.model.BaseSlide',

        'TE.themes.black_white.view.properties.MainTitleSlide',
        'TE.themes.black_white.view.properties.SectionSlide',
        'TE.themes.black_white.view.properties.BaseSlide'
    ]
});
