Ext.define('TE.themes.common.model.PictureSlide', {
    extend: 'TE.model.Page',
    fields: [
        // Local file path or URL
        'picture',
        // Picture size in % of original size
        { name: 'picturescalepercent', type: 'float', defaultValue: 100 },
        // Picture position in pixels (relative to text area)
        { name: 'picturex', type: 'float', defaultValue: 0 },
        { name: 'picturey', type: 'float', defaultValue: 0 },
        // Optional HTML/plain text for right/left columns
        'left_column', 'right_column'
    ]
})
