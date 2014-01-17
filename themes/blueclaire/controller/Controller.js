Ext.define('TE.themes.blueclaire.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.blueclaire.model.MainTitleSlide',
        'TE.themes.blueclaire.model.SectionSlide',
        'TE.themes.blueclaire.model.BaseSlide',

        'TE.themes.blueclaire.view.properties.MainTitleSlide',
        'TE.themes.blueclaire.view.properties.SectionSlide',
        'TE.themes.blueclaire.view.properties.BaseSlide'
    ]
});