Ext.define('TE.controller.vellum.Vellum', {
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
            'textfield': {
                blur: function() { this.updatePage(); }
            }
        });
    }
});