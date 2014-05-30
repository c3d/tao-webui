Ext.define('TE.view.EditResourceFile', {
    extend: 'Ext.window.Window',
    alias: 'widget.teeditresourcefile',

    type: '',   // 'image', 'mvimage', 'video'

    title: '',

    width: 400,
    autoShow: true,
    modal: true,

    initComponent: function() {
        var me = this;

        switch(this.type) {
            case 'image'  : this.title = tr('Edit image'); break;
            case 'mvimage': this.title = tr('Edit multiview image'); break;
            case 'video'  : this.title = tr('Edit video'); break;
            default       : this.title = tr('Edit unknown ' + this.type); break;
        }

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
                        // Cosmetic - remove 'fakepath' string if present
                        // (Google Chrome), it's ugly
                        var node = Ext.DomQuery.selectNode('input[id='+f.getInputId()+']');
                        node.value = v.replace("C:\\fakepath\\","");

                        var desc = me.up().down('#descfield');
                        if (desc.getValue().length === 0)
                            desc.setValue(node.value);
                    },
                    afterrender: function(cmp) {
                        var accept;
                        switch (me.type) {
                            case 'image':
                            case 'mvimage':
                            case 'video':
                                accept = me.type + '/*';
                                break;
                            default:
                                console.log('Unexpected type');
                                return;
                        }
                        cmp.fileInputEl.set({
                            accept: accept
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
