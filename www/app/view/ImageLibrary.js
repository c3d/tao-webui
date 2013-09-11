Ext.define('TE.view.ImageLibrary', {
    extend: 'Ext.window.Window',
    alias: 'widget.teimagelibrary',

    title: tr('Image Library'),
    layout: 'fit',
    autoShow: true,

    items: [{
        xtype: 'gridpanel',
        width: 600,
        height: 600,
        store: 'Images',

        columns: [{
            header: '',
            dataIndex: 'url',
            width: 100,
            renderer: function(v, meta, rec, rowIndex) {
                var imgsrc = url = rec.get('url');
                if (url.indexOf('http') !== 0)
                    imgsrc = '/imagelibrary/' + url;
                return '<img src="' + imgsrc + '" width=\"80\" title=\"' + url + '\" />';
            },
            sortable: false
        },{
            header: tr('Name'),
            flex: 1,
            dataIndex: 'displayname',
            sortable: false
        }],

        dockedItems: [{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [
                { xtype: 'button', text: 'Button 1' }
            ]
        }]
    }]
});