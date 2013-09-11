Ext.define('TE.view.EditImageURL', {
    extend: 'Ext.window.Window',
    alias: 'widget.teeditimageurl',

    title: tr('Edit image'),

    width: 400,
    layout: 'fit',
    autoShow: true,
    modal: true,

    initComponent: function() {

        this.items = [{
            xtype: 'form',
            items: [{
                xtype: 'textfield',
                name: 'displayname',
                fieldLabel: tr('Name')
            },{
                xtype: 'textfield',
                name: 'url',
                fieldLabel: 'Image URL'
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
