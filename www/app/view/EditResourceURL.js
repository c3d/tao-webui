Ext.define('TE.view.EditResourceURL', {
    extend: 'Ext.window.Window',
    alias: 'widget.teeditresourceurl',

    type: '',   // 'image', 'video'

    title: '',

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
                name: 'description',
                fieldLabel: tr('Description')
            },{
                name: 'file',
                fieldLabel: tr('Image URL')
            }]
        }];

        this.buttons = [{
            text: tr('OK'),
            action: 'save'
        },{
            text: tr('Cancel'),
            scope: this,
            handler: this.close
        }];

        this.callParent(arguments);
    }
 });