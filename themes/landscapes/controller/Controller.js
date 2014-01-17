Ext.define('TE.themes.landscapes.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.landscapes.model.MainTitleSlide',
        'TE.themes.landscapes.model.SectionSlide',
        'TE.themes.landscapes.model.BaseSlide',

        'TE.themes.landscapes.view.properties.MainTitleSlide',
        'TE.themes.landscapes.view.properties.SectionSlide',
        'TE.themes.landscapes.view.properties.BaseSlide'
    ]
});
