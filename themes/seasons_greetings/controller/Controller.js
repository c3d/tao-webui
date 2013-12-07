Ext.define('TE.themes.seasons_greetings.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.seasons_greetings.model.MainTitleSlide',
        'TE.themes.seasons_greetings.model.SectionSlide',
        'TE.themes.seasons_greetings.model.PictureSlide',
        'TE.themes.seasons_greetings.model.MovieSlide',
        'TE.themes.seasons_greetings.model.Slide',
        'TE.themes.seasons_greetings.model.BaseSlide',

        'TE.themes.seasons_greetings.view.properties.MainTitleSlide',
        'TE.themes.seasons_greetings.view.properties.SectionSlide',
        'TE.themes.seasons_greetings.view.properties.PictureSlide',
        'TE.themes.seasons_greetings.view.properties.MovieSlide',
        'TE.themes.seasons_greetings.view.properties.Slide',
        'TE.themes.seasons_greetings.view.properties.BaseSlide'
    ]
});
