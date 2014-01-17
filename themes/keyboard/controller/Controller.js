Ext.define('TE.themes.keyboard.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.keyboard.model.MainTitleSlide',
        'TE.themes.keyboard.model.SectionSlide',
        'TE.themes.keyboard.model.BaseSlide',

        'TE.themes.keyboard.view.properties.MainTitleSlide',
        'TE.themes.keyboard.view.properties.SectionSlide',
        'TE.themes.keyboard.view.properties.BaseSlide'
    ]
});