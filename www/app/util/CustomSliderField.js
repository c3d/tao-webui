Ext.define('TE.util.CustomSliderField', {
    extend: 'Ext.form.FieldSet',
    requires:['Ext.slider.Single'],
    alias: 'widget.te_slider',
    collapsible: true,
    collapsed:false,
    items: [
        {
            xtype:'slider',
            anchor:'100%',
            value: 0,
            minValue: 0,
            maxValue: 100,
            listeners: {
                change: function(f)
                {
                    // Fire change event to fieldset
                    this.ownerCt.fireEvent('change', this.ownerCt);
                }
            },
            tipText: function(thumb)
            {
                var step = thumb.slider.step || 1;
                var prec = -Math.floor(Math.log(step) / Math.LN10);
                return (thumb.value * step).toFixed(prec);
            }
        }
    ],


    getValue: function()
    // ------------------------------------------------------------------------
    //   Return textfield value in a json object
    // ------------------------------------------------------------------------
    {
        var me = this.down('slider');
        var step = this.step || 1;
        var value = me.getValue() * step;
        return value;
    },


    setValue: function(value)
    // ------------------------------------------------------------------------
    //   Set textfield values according to a json object
    // ------------------------------------------------------------------------
    {
        var me = this.down('slider');
        var step = this.step || 1;
        if (value.hasOwnProperty('step'))
            this.step = step = value.step;
        if (value.hasOwnProperty('min'))
            this.min = value.min;
        if (value.hasOwnProperty('max'))
            this.max = value.max;
        if (value.hasOwnProperty('value'))
            value = value.value;
        me.step = step;
        if (this.hasOwnProperty('min'))
            me.setMinValue(this.min / step);
        if (this.hasOwnProperty('max'))
            me.setMaxValue(this.max / step);
        me.setValue(value / step);
    },


    parseJSON: function(json)
    // ------------------------------------------------------------------------
    //   Override parseJSON methd to decode only the text field
    // ------------------------------------------------------------------------
    {
        return this.setValue(json);
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method to encode only textfield value.
    // ------------------------------------------------------------------------
    {
        var me = this.down('slider');
        var step = this.step || 1;
        var prec = -Math.floor(Math.log(step) / Math.LN10);
        var json = parseFloat((me.getValue() * step).toFixed(prec));
        if (this.hasOwnProperty('min') ||
            this.hasOwnProperty('max') ||
            this.hasOwnProperty('step'))
            json = { value: json };

        if (this.hasOwnProperty('min'))
            json.min = this.min;
        if (this.hasOwnProperty('max'))
            json.max = this.max;
        if (this.hasOwnProperty('step'))
            json.step = this.step;

        return Ext.encode(json);
    }
});
