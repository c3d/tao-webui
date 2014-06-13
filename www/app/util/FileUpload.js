Ext.define('TE.util.FileUpload', {
    extend: 'Ext.window.Window',
    title: 'Upload files',
    id: 'file_upload_container',
    modal: true,
    closable: false,
    width: 400,
    editor: false,

    signalUploadComplete: function(info) {
        var label = this.down('#file_upload_status');
        label.update('<div>' + info + '</div>');
    },
 
    items: [{
        id: 'FilesDropZone',
        xtype: 'container',
        height: 100,
        border: false,
        html: '<div id="upload_drop_zone" style="padding:26px 40px;">Drop files here</div>',
        ddGroup: 'filesDDGroup',
 
        style: { backgroundColor: '#fff', padding: '5px' },
 
        listeners: {
            afterrender: function () {
                var dropTarget = this.getEl();
                var dropTargetEl = dropTarget.dom;
                // var dropInnerZone = this.down('#upload_drop_zone');
                var me = this;

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

                    var files, datasetName;
 
                    // Stop the browser's default behavior when
                    // dropping files in the viewable area
                    evt.stopPropagation();
                    evt.preventDefault();
 
                    // Get the name of the selected data set
                    datasetName = "Multiview pictures";
 
                    // A reference to the files selected
                    files = evt.dataTransfer.files;
 
                    // Currently, I have a separate library that holds
                    // reusable functions to access our public API
                    var win = Ext.getCmp('file_upload_container');
                    var editor = win.editor;
                    editor.uploadFiles(datasetName, files, win);
 
                }, false);
            }
        }
    },{
        xtype: 'container',
        id: 'FilesField',
        style: { padding: '5px' },
 
        // Just adding a typical multipart file field here to a container
        html: '<div style="padding:0 0 5px 0;">or upload your files the traditional way...</div> <input id="upload_files" type="file" name="files" multiple="multiple" webkitdirectory style="margin:0 0 0 30px;" />',

        listeners: {
            afterrender: function () {
 
                // This code is, essentially, the same as above
                Ext.get('upload_files').on('change', function (evt) {
                    var files, datasetName;
 
                    evt.stopPropagation();
                    evt.preventDefault();
 
                    // Get the name of the selected data set
                    datasetName = "Multiview pictures";
 
                    // A reference to the files selected
                    files = evt.target.files;

                    // Upload files to the server
                    var win = Ext.getCmp('file_upload_container');
                    var editor = win.editor;
                    editor.uploadFiles(datasetName, files, win);
                });
            }
        }
    },{
        xtype:'container',
        id: 'file_upload_status',
        html: '<div>Ready to upload</div>',
        width: 400
    }],
 
    buttons : [{
        text: 'Close',
        iconCls: 'cancel-icon',
        handler: function() {
            this.up('window').close();
        }
    }]
});
