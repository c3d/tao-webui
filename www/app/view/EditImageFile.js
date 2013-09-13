Ext.define('TE.view.EditImageFile', {
    extend: 'Ext.window.Window',
    alias: 'widget.teeditimagefile',

    title: tr('Edit image'),

    width: 400,
    autoShow: true,
    modal: true,

    initComponent: function() {

        this.items = [{
            xtype: 'form',
            border: false,
            bodyPadding: 5,

            fieldDefaults: {
                labelWidth: 100,
                anchor: '100%'
            },

            items: [{
                xtype: 'textfield',
                itemId: 'descfield',
                name: 'description',
                fieldLabel: tr('Description')
            },{
                xtype: 'filefield',
                name: 'file',
                fieldLabel: tr('File'),
                buttonText: tr('Browse...'),

                listeners: {
                    change: function(f,v) {
                        // Cosmetic - remove 'fakepath' string if present (Google Chrome), it's ugly
                        var node = Ext.DomQuery.selectNode('input[id='+f.getInputId()+']');
                        node.value = v.replace("C:\\fakepath\\","");

                        var desc = this.up().down('#descfield');
                        if (desc.getValue().length === 0)
                            desc.setValue(node.value);
                    },
                    afterrender: function(cmp) {
                        cmp.fileInputEl.set({
                            accept: 'image/*'
                        });
                    }
                }
            }]
        }];

        this.buttons = [{
            text: tr('OK'),
            action: 'upload'
        },{
            text: tr('Cancel'),
            scope: this,
            handler: this.close
        }];

        this.callParent(arguments);
    }
 });
