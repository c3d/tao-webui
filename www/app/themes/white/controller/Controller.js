Ext.define('TE.themes.white.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.white.model.TitleAndBullets',
        'TE.themes.white.model.PhotoHorizontal',

        'TE.themes.white.view.properties.TitleAndBullets',
        'TE.themes.white.view.properties.PhotoHorizontal'
    ]
});