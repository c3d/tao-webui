Ext.define('TE.controller.white.White', {
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