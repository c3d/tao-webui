Ext.define('TE.themes.water.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.water.model.MainTitleSlide',
        'TE.themes.water.model.SectionSlide',
        'TE.themes.water.model.PictureSlide',
        'TE.themes.water.model.MovieSlide',
        'TE.themes.water.model.Slide',
        'TE.themes.water.model.BaseSlide',

        'TE.themes.water.view.properties.MainTitleSlide',
        'TE.themes.water.view.properties.SectionSlide',
        'TE.themes.water.view.properties.PictureSlide',
        'TE.themes.water.view.properties.MovieSlide',
        'TE.themes.water.view.properties.Slide',
        'TE.themes.water.view.properties.BaseSlide'
    ]
});
