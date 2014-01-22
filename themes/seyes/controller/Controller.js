Ext.define('TE.themes.seyes.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.seyes.model.MainTitleSlide',
        'TE.themes.seyes.model.SectionSlide',
        'TE.themes.seyes.model.BaseSlide',

        'TE.themes.seyes.view.properties.MainTitleSlide',
        'TE.themes.seyes.view.properties.SectionSlide',
        'TE.themes.seyes.view.properties.BaseSlide'
    ]
});
