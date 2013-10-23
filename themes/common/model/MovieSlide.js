Ext.define('TE.themes.common.model.MovieSlide', {
    extend: 'TE.model.Page',
    fields: [
        // Local file path or URL
        'movie',
        // Movie size in % of original size
        { name: 'moviescalepercent', type: 'float', defaultValue: 100 },
        // Movie position in pixels (relative to text area)
        { name: 'moviex', type: 'float', defaultValue: 0 },
        { name: 'moviey', type: 'float', defaultValue: 0 },
        // Optional HTML/plain text for right/left columns
        'leftcolumn', 'rightcolumn'
    ]
})
