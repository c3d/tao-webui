Ext.define('TE.view.ResourceLibrary', {
    extend: 'Ext.window.Window',
    alias: 'widget.teresourcelibrary',

    title: '', // Set by derived classes
    layout: 'fit',
    autoShow: true,
    modal: true,
    showChooseButton: false,
    targetField: null,
    store: '',  // E.g., 'Images' or 'Movies' or 'MultviewImages' or 'Models'
    type: '',   // E.g., 'image' or 'movie' or 'mvimage' or 'model'

    initComponent: function() {
        var me = this;

        this.items = [{
            xtype: 'gridpanel',
            width: 600,
            height: 600,
            store: this.store,

            listeners: {
                afterrender: function () {
                    var dropTarget = this.getEl();
                    var dropTargetEl = dropTarget.dom;

                    function dragOver(event) {
                        dropTarget.setStyle('background-color', '#ccc');
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        return false;
                    }

                    function dragLeave(event) {
                        dropTarget.setStyle('background-color', '#fff');
                        return true;
                    }

                    // Cancel default behaviors to enable drag and drop
                    dropTargetEl.addEventListener('dragover', dragOver);
                    dropTargetEl.addEventListener('dragenter', dragOver);
                    dropTargetEl.addEventListener('dragleave', dragLeave);

                    // When the user drops files onto the drop zone,
                    // capture the file references and immediately upload
                    dropTargetEl.addEventListener('drop', function (evt) {
                        dropTarget.setStyle('background-color', '#fff');

                        // Stop the browser's default behavior when
                        // dropping files in the viewable area
                        evt.stopPropagation();
                        evt.preventDefault();

                        // A reference to the files selected
                        var files = evt.dataTransfer.files;

                        // Upload files
                        me.uploadFiles('/' + me.type + '-upload', files, me);

                    }, false);
                }
            },

            columns: [{
                header: tr('Preview'),
                dataIndex: 'file',
                width: 100,
                renderer: function(v, meta, rec, rowIndex) {
                    var type = rec.get('type') || '';
                    if (type === 'image' || type === 'mvimage')
                    {
                        var imgsrc = file = rec.get('file');
                        if (file.indexOf('://') === -1)
                            imgsrc = '/library/images/' + file;
                        if (type === 'mvimage')
                            imgsrc = imgsrc.replace('#', '1');
                        return '<img src="' + imgsrc + '" width=\"80\" title=\"' + file + '\" />';
                    }
                    else
                    {
                        return '&mdash;';
                    }
                },
                sortable: false
            },{
                header: tr('Type'),
                dataIndex: 'file',
                width: 60,
                sortable: false,
                renderer: function(v, meta, rec, rowIndex) {
                    var file = rec.get('file');
                    return (file.indexOf('://') === -1) ? tr('File') : tr('URL');
                }
            },{
                header: tr('Path/URL'),
                dataIndex: 'file',
                renderer: function(value,metaData,record,rowIdx,colIdx,store) {
                    metaData.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                },
                sortable: false
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
                }, {
                    xtype: 'container',
                    id: 'upload_status',
                    style: { color: '#999' },
                    html: '<div>' + tr('You can drop files in this window') + '</div>'
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
        },{
            id: 'FilesDropZone',
            xtype: 'container',
            height: 100,
            border: false,
            html: '<div id="upload_drop_zone" style="padding:26px 40px;">Drop files here</div>',
            ddGroup: 'filesDDGroup',

            style: { backgroundColor: '#fff', padding: '5px' },

        }];

        this.callParent(arguments);
    },

    // Upload documents to the server using XHR
    uploadFiles : function (URI, files, me) {
        formData = new FormData(),
        xhr = new XMLHttpRequest();

        // Append each file to the FormData() object
        var movies = /\.(mp[1-4]|avi|ogg|mov|3gp)$/i;
        var pictures = /\.(jpg|jpeg|png|bmp|tif|tiff|tga|gif)$/i;
        var models = /\.(3ds|obj|mtl|dae)$/i;
        var filter = (me.type === 'movie') ? movies
                   : (me.type === 'model') ? models
                   : pictures;
        var count = 0;
        for (var i = 0; i < files.length; i++) {
            if (filter.test(files[i].name)) {
                formData.append('file', files[i]);
                count++;
            }
        }

        if (count > 0) {
            // Define the URI and method to which we are sending the files
            xhr.open('POST', URI);

            // Define any actions to take once the upload is complete
            xhr.onloadend = function (evt) {
                // Show a message containing the result of the upload
                if (evt.target.status === 200) {
                    // Tell the user somehow that the upload succeeded
                    me.info('Upload successful');

                    // Update the store
                    var store = me.storeDB;

                    function addResource(file)
                    {
                        var record = { file: file,
                                       type: me.type,
                                       description: "" };
                        store.add(record);
                    }

                    // Update the resources library
                    var response = JSON.parse(evt.target.response);
                    if (response.success) {
                        if (Array.isArray(response.file))
                        {
                            for (var i = 0; i < response.file.length; i++) {
                                addResource(response.file[i]);
                            }
                        } else {
                            addResource(response.file);
                        }
                        store.sync();
                    }

                } else {
                    // Tell the user somehow that the upload failed
                    me.info('Upload failed');
                }
                setTimeout(function() {
                    me.info('Ready to upload again');
                }, 1000);
            }

            // Start the upload process
            xhr.send(formData);
        }
    },

    // Update label with function
    info: function(lbl) {
        var uploadStatus = this.down('#upload_status');
        uploadStatus.update('<div>' + lbl + '</div>');
    }
});
