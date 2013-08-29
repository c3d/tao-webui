Ext.define('TE.controller.white.White', {
    extend: 'TE.controller.PageControllerBase',

    models: [
        'white.PhotoHorizontal'
    ],
    views: [
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