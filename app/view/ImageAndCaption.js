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

        this.image = cfg.image;
        this.caption = cfg.caption;
        Ext.apply(this, {
            items: [{   
                xtype: 'image',
                autoEl: 'div',
                src: this.image,
            },
            {
                xtype: 'container',
                html: this.caption,
            }]
        });
        this.initConfig(cfg);
        this.callParent(arguments);
    },

    initComponent: function(config) {
        console.log('view.ImageAndCaption initComponent');
        this.callParent(arguments);
     }
 });
