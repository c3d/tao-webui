Ext.define('TE.themes.blueclaire.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.blueclaire.model.MainTitleSlide',
        'TE.themes.blueclaire.model.SectionSlide',
        'TE.themes.blueclaire.model.PictureSlide',
        'TE.themes.blueclaire.model.MovieSlide',
        'TE.themes.blueclaire.model.Slide',

        'TE.themes.blueclaire.view.properties.MainTitleSlide',
        'TE.themes.blueclaire.view.properties.SectionSlide',
        'TE.themes.blueclaire.view.properties.PictureSlide',
        'TE.themes.blueclaire.view.properties.MovieSlide',
        'TE.themes.blueclaire.view.properties.Slide'
    ]
});