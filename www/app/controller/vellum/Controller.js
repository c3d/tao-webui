Ext.define('TE.controller.vellum.Controller', {
    extend: 'TE.controller.PageControllerBase',

    models: [
        'vellum.TitleAndSubtitle',
        'vellum.TitleBulletsAndPhoto'
    ],
    views: [
        'properties.vellum.TitleAndSubtitle',
        'properties.vellum.TitleAndSubtitle'
    ],

    init: function() {
        this.control({
            'textfield, customhtmleditor': {
                blur: function() { this.updatePage(); }
            }
        });
    }
});
