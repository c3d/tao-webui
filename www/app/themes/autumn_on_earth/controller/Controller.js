Ext.define('TE.themes.autumn_on_earth.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.autumn_on_earth.model.MainTitleSlide',
        'TE.themes.autumn_on_earth.model.SectionSlide',
        'TE.themes.autumn_on_earth.model.PictureSlide',
        'TE.themes.autumn_on_earth.model.MovieSlide',
        'TE.themes.autumn_on_earth.model.Slide',

        'TE.themes.autumn_on_earth.view.properties.MainTitleSlide',
        'TE.themes.autumn_on_earth.view.properties.SectionSlide',
        'TE.themes.autumn_on_earth.view.properties.PictureSlide',
        'TE.themes.autumn_on_earth.view.properties.MovieSlide',
        'TE.themes.autumn_on_earth.view.properties.Slide'
    ]
});