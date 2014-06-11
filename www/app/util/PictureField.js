Ext.define('TE.util.PictureField', {
    extend:'TE.util.FieldSet',
    requires: [ 'TE.util.SliderField' ],
    alias: 'widget.te_picturefield',

    initComponent: function()
    // ------------------------------------------------------------------------
    //   Initialize the component for a picture
    // ------------------------------------------------------------------------
    {
        var me = this;
        var index = this.name.replace(/.*(_[0-9]+)/, '$1');
        if (index == this.name)
            index = '';

        Ext.apply(me, {
            items: [{
                xtype: 'teimagepickerfield',
                name: 'url' + index,
                itemId: 'url',
                labelAlign:'top',
                fieldLabel: tr('Picture', 'common'),
                anchor:'100%'
            },
            {
                xtype: 'te_slider',
                name: 'scale' + index,
                itemId: 'scale',
                labelAlign:'top',
                fieldLabel: tr('Picture scale (%)', 'common'),
                allowBlank: false,
                anchor:'100%',
                min: 0.1, max: 1000, step: 0.1
            },
            {
                xtype: 'te_slider',
                name: 'x' + index,
                itemId: 'x',
                labelAlign:'top',
                fieldLabel: tr('Picture horizontal position', 'common'),
                allowBlank: false,
                anchor:'100%',
                min: -2000, max: 2000, step: 0.1
            },
            {
                xtype: 'te_slider',
                name: 'y' + index,
                itemId: 'y',
                labelAlign:'top',
                fieldLabel: tr('Picture vertical position', 'common'),
                allowBlank: false,
                anchor:'100%',
                min: -2000, max: 2000, step: 0.1
            }],
        });
        me.callParent( arguments );
    },

    listeners:
    // ------------------------------------------------------------------------
    //   Make sure we propagate changes up
    // ------------------------------------------------------------------------
    {
        change: function(f)
        {
            // Fire change event to fieldset
            this.ownerCt.fireEvent('change', this.ownerCt);
        }
    },

    toJSON: function()
    // ------------------------------------------------------------------------
    //    Encode slider values to JSON
    // ------------------------------------------------------------------------
    {
        var url = this.down('#url').getValue();
        var scale = this.down('#scale').getValue().toFixed(1);
        var x = this.down('#x').getValue().toFixed(1);
        var y = this.down('#y').getValue().toFixed(1);
        json = '{' +
            '"url": "' + url   + '",' +
            '"scale":' + scale + ',' +
            '"x":'     + x     + ',' +
            '"y":'     + y     +
            '}';
        return json;
    }
});
