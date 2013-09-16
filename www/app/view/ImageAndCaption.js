Ext.define('TE.view.ImageAndCaption', {
    extend: 'Ext.container.Container',
    alias: 'widget.imageandcaption',

    image: '',
    caption: '',
    maxCaptionLen: 0,

    layout: {
        type: 'vbox',
        align: 'center',
        defaultMargins: '5'
    },

    listeners: {
        render: function(c) {
            c.getEl().on('click', function() { this.fireEvent('click', c); }, c);
            c.getEl().on('dblclick', function() { this.fireEvent('dblclick', c); }, c);
            c.getEl().on('contextmenu', function(e, t) {
                    e.stopEvent(); this.fireEvent('contextmenu', c, t);
                }, c);
        }
    },

    initComponent: function(config) {
        var caption = this.caption;
        var ellidedCaption = (this.maxCaptionLen !== 0) ?
                                Ext.String.ellipsis(caption, this.maxCaptionLen) :
                                this.caption;
        Ext.apply(this, {
            items: [{   
                xtype: 'image',
                src: this.image,
                // Chrome:
                // If width and height are not specified, image is shown only partially
                // on first draw
                width: 64,
                height: 48
            },
            {
                xtype: 'container',
                html: ellidedCaption,
                listeners: (ellidedCaption.length === caption.length) ? {} : {
                    // Show un-truncated name as a tooltip
                    render: function(c) {
                        this.getEl().dom.title = caption;
                    }
                }
            }]
        });

        this.callParent(arguments);
     },

    toggleSelected: function(on) {
        if (this.el === undefined)
            return;
        if (on === true)
            this.el.addCls('te-selectedicon');
        else
            this.el.removeCls('te-selectedicon');
     }
 });
