Ext.define('TE.view.ImageLibrary', {
    extend: 'Ext.window.Window',
    alias: 'widget.teimagelibrary',

    title: tr('Image library'),
    layout: 'fit',
    autoShow: true,
    modal: true,
    showChooseButton: false,
    targetField: null,

    initComponent: function() {
        this.items = [{
            xtype: 'gridpanel',
            width: 600,
            height: 600,
            store: 'Images',

            columns: [{
                header: tr('Preview'),
                dataIndex: 'file',
                width: 100,
                renderer: function(v, meta, rec, rowIndex) {
                    var type = rec.get('type') || '';
                    if (type === 'image')
                    {
                        var imgsrc = file = rec.get('file');
                        if (file.indexOf('://') === -1)
                            imgsrc = '/library/images/' + file;
                        return '<img src="' + imgsrc + '" width=\"80\" title=\"' + file + '\" />';
                    }
                    else
                    {
                        return '<div/>';
                    }
                },
                sortable: false
            },{
                header: tr('Type'),
                dataIndex: 'file',
                width: 60,
                sortable: false,
                renderer: function(v, meta, rec, rowIndex) {
                    return (file.indexOf('://') === -1) ? tr('File') : tr('URL');
                }
            },{
                header: tr('Description'),
                flex: 1,
                dataIndex: 'description',
                sortable: false
            }],

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'button',
                    text: tr('Delete'),
                    icon: 'app/resources/images/delete.png',
                    action: 'delete',
                    disabled: true
                }, {
                    xtype: 'button',
                    text: tr('Edit'),
                    icon: 'app/resources/images/edit.png',
                    action: 'edit',
                    disabled: true
                }, {
                    xtype: 'button',
                    text: tr('Add URL...'),
                    icon: 'app/resources/images/add.png',
                    action: 'addUrl'
                }, {
                    xtype: 'button',
                    text: tr('Add file...'),
                    icon: 'app/resources/images/add.png',
                    action: 'addFile'
                },
                '->',
                {
                    xtype: 'button',
                    text: tr('Choose'),
                    icon: 'app/resources/images/accept.png',
                    hidden: !this.showChooseButton,
                    disabled: true,
                    action: 'choose'
                }]
            }]
        }];

        this.callParent(arguments);
    }
});