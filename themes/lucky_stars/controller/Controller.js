Ext.define('TE.themes.lucky_stars.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.lucky_stars.model.MainTitleSlide',
        'TE.themes.lucky_stars.model.SectionSlide',
        'TE.themes.lucky_stars.model.BaseSlide',
        'TE.themes.lucky_stars.model.TextCrawl',

        'TE.themes.lucky_stars.view.properties.MainTitleSlide',
        'TE.themes.lucky_stars.view.properties.SectionSlide',
        'TE.themes.lucky_stars.view.properties.BaseSlide',
        'TE.themes.lucky_stars.view.properties.TextCrawl'
    ]
});
