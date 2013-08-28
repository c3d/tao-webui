Ext.define('TE.controller.vellum.Vellum', {
    extend: 'TE.controller.PageControllerBase',

    models: ['vellum.TitleAndSubtitle'],
    views: ['properties.vellum.TitleAndSubtitle'],

    init: function() {
        this.control({
            'textfield': {
                blur: function() { this.updatePage(); }
            }
        });
    }
});