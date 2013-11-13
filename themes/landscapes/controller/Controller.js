Ext.define('TE.themes.landscapes.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.landscapes.model.MainTitleSlide',
        'TE.themes.landscapes.model.SectionSlide',
        'TE.themes.landscapes.model.PictureSlide',
        'TE.themes.landscapes.model.MovieSlide',
        'TE.themes.landscapes.model.Slide',
        'TE.themes.landscapes.model.BaseSlide',

        'TE.themes.landscapes.view.properties.MainTitleSlide',
        'TE.themes.landscapes.view.properties.SectionSlide',
        'TE.themes.landscapes.view.properties.PictureSlide',
        'TE.themes.landscapes.view.properties.MovieSlide',
        'TE.themes.landscapes.view.properties.Slide',
        'TE.themes.landscapes.view.properties.BaseSlide'
    ]
});
