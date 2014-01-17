Ext.define('TE.themes.bright_rectangles.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.bright_rectangles.model.MainTitleSlide',
        'TE.themes.bright_rectangles.model.SectionSlide',
        'TE.themes.bright_rectangles.model.BaseSlide',

        'TE.themes.bright_rectangles.view.properties.MainTitleSlide',
        'TE.themes.bright_rectangles.view.properties.SectionSlide',
        'TE.themes.bright_rectangles.view.properties.BaseSlide'
    ]
});
