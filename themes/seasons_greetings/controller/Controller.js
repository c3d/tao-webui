Ext.define('TE.themes.seasons_greetings.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.seasons_greetings.model.MainTitleSlide',
        'TE.themes.seasons_greetings.model.SectionSlide',
        'TE.themes.seasons_greetings.model.BaseSlide',

        'TE.themes.seasons_greetings.view.properties.MainTitleSlide',
        'TE.themes.seasons_greetings.view.properties.SectionSlide',
        'TE.themes.seasons_greetings.view.properties.BaseSlide'
    ]
});
