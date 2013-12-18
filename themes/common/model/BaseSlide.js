Ext.define('TE.themes.common.model.BaseSlide', {
    extend: 'TE.model.Page',
    requires: ['TE.util.CustomHtmlEditor', 'TE.util.CustomChartEditor'],
    fields: [
        'title',        // HTML
        'subtitle',     // HTML
        'story',        // HTML
        'left_column',  // HTML
        'right_column', // HTML
        'picture',      // Local file path or URL
        { name: 'picscale', type: 'float', defaultValue: 100 }, // Picture size in % of original size
        { name: 'picx', type: 'float', defaultValue: 0 },       // X offset in pixels
        { name: 'picy', type: 'float', defaultValue: 0 },       // Y offset in pixels
        'left_picture',
        { name: 'lpicscale', type: 'float', defaultValue: 100 },
        { name: 'lpicx', type: 'float', defaultValue: 0 },
        { name: 'lpicy', type: 'float', defaultValue: 0 },
        'right_picture',
        { name: 'rpicscale', type: 'float', defaultValue: 100 },
        { name: 'rpicx', type: 'float', defaultValue: 0 },
        { name: 'rpicy', type: 'float', defaultValue: 0 },
        'chart',
        { name: 'charttitle', type: 'textfield' },
        { name: 'charttype', type: 'text', defaultValue: 'Bar'},
        { name: 'chartstyle', type: 'text', defaultValue: 'Vertical'},
        { name: 'chartdata', type: 'hiddenfield'},
        { name: 'chartxlabel', type: 'textfield'},
        { name: 'chartylabel', type: 'textfield'},
        { name: 'chartlegend', type: 'textfield'},
        { name: 'chartdatasets', type: 'textfield'},
    ]
})
