Ext.define('TE.themes.keyboard.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.keyboard.model.MainTitleSlide',
        'TE.themes.keyboard.model.SectionSlide',
        'TE.themes.keyboard.model.PictureSlide',
        'TE.themes.keyboard.model.MovieSlide',
        'TE.themes.keyboard.model.Slide',
        'TE.themes.keyboard.model.BaseSlide',

        'TE.themes.keyboard.view.properties.MainTitleSlide',
        'TE.themes.keyboard.view.properties.SectionSlide',
        'TE.themes.keyboard.view.properties.PictureSlide',
        'TE.themes.keyboard.view.properties.MovieSlide',
        'TE.themes.keyboard.view.properties.Slide',
        'TE.themes.keyboard.view.properties.BaseSlide'
    ]
});