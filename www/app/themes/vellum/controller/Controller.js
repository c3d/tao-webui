Ext.define('TE.themes.vellum.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.vellum.model.TitleAndSubtitle',
        'TE.themes.vellum.model.TitleBulletsAndPhoto',

        'TE.themes.vellum.view.properties.TitleAndSubtitle',
        'TE.themes.vellum.view.properties.TitleBulletsAndPhoto'
    ]
});
