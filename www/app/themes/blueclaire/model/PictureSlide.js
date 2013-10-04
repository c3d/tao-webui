Ext.define('TE.themes.blueclaire.model.PictureSlide', {
	extend: 'TE.model.Page',
    fields: [
        // Local file path or URL
        'picture',
        // Picture size in % of original size
        { name: 'scalepercent', type: 'float', defaultValue: 100 },
        // Picture position in pixels (relative to text area)
        { name: 'imagex', type: 'float', defaultValue: 0 },
        { name: 'imagey', type: 'float', defaultValue: 0 },
    ]
})
