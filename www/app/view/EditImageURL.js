Ext.define('TE.view.EditImageURL', {
    extend: 'Ext.window.Window',
    alias: 'widget.teeditimageurl',

    title: tr('Edit image'),

    width: 400,
    autoShow: true,
    modal: true,

    initComponent: function() {

        this.items = [{
            xtype: 'form',
            border: false,
            bodyPadding: 5,

            defaultType: 'textfield',
            fieldDefaults: {
                labelWidth: 100,
                anchor: '100%'
            },

            items: [{
                name: 'displayname',
                fieldLabel: tr('Name')
            },{
                name: 'url',
                fieldLabel: tr('Image URL')
            }]
        }];

        this.buttons = [{
            text: tr('Save'),
            action: 'save'
        },{
            text: tr('Cancel'),
            scope: this,
            handler: this.close
        }];

        this.callParent(arguments);
    }
 });
