Ext.define('TE.fields.add_menu', {
    extend: 'TE.util.PageMenu',

    menuItems: [
        {
            itemId:'picture',
            text: tr('Picture'),
            action: 'addField'
        },
        {
            itemId:'movie',
            text: tr('Movie'),
            action: 'addField'
        },
        {
            itemId:'chart',
            text: tr('Chart'),
            action: 'addField'
        },
        '-',
        {
            itemId:'title',
            text: tr('Title'),
            action: 'addField'
        },
        {
            itemId:'subtitle',
            text: tr('Subtitle'),
            action: 'addField'
        },
        {
            itemId:'story',
            text: tr('Story text'),
            action: 'addField'
        }
    ]    
});
