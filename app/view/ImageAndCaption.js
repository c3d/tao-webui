Ext.define('TE.view.ImageAndCaption', {
    extend: 'Ext.container.Container',
    alias: 'widget.imageandcaption',

    image: '',
    caption: '',

    layout: {
        type: 'vbox',
        align: 'center',
        defaultMargins: '5'
    },

    listeners: {
        render: function(c) {
            c.getEl().on('click', function() { this.fireEvent('click', c); }, c);
        }
    },

    constructor: function(cfg) {

        Ext.apply(this, cfg);
        Ext.apply(this, {
            items: [{   
                xtype: 'image',
                autoEl: 'div',
                itemId: 'image',
                src: this.image,
            },
            {
                xtype: 'container',
                itemId: 'caption',
                html: this.caption,
            }]
        });
        this.initConfig(cfg);
        this.callParent(arguments);
    },

    initComponent: function(config) {
        this.callParent(arguments);
     },

    toggleSelected: function(on) {
        if (on === true)
            this.el.addCls('te-selectedicon');
        else
            this.el.removeCls('te-selectedicon');
     }
 });
