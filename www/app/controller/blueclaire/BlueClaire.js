Ext.define('TE.controller.blueclaire.BlueClaire', {
    extend: 'TE.controller.PageControllerBase',

    models: [
        'blueclaire.MainTitleSlide',
        'blueclaire.SectionSlide',
        'blueclaire.PictureSlide',
        'blueclaire.Slide'
    ],
    views: [
        'properties.blueclaire.MainTitleSlide',
        'properties.blueclaire.SectionSlide',
        'properties.blueclaire.PictureSlide',
        'properties.blueclaire.Slide'
    ],

    init: function() {
        this.control({
            'textfield, customhtmleditor': {
                blur: function() { this.updatePage(); }
            }
        });
    }
});