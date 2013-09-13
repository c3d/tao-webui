Ext.define('TE.controller.white.Controller', {
    extend: 'TE.controller.PageControllerBase',

    models: [
        'white.TitleAndBullets',
        'white.PhotoHorizontal'
    ],
    views: [
        'properties.white.TitleAndBullets',
        'properties.white.PhotoHorizontal'
    ],

    init: function() {
        this.control({
            'textfield': {
                blur: function() { this.updatePage(); }
            }
        });
    }
});