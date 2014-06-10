Ext.define('TE.util.SliderField', {
    extend: 'Ext.form.FieldSet',
    requires:['Ext.slider.Single'],
    alias: 'widget.te_slider',
    collapsible: true,
    collapsed:false,
    layout: 'hbox',
    items: [
        {
            xtype:'slider',
            width: '75%',
            value: 0,
            minValue: 0,
            maxValue: 100,
            padding: '5 0 0 0',
            listeners: {
                change: function(f)
                {
                    // Fire change event to fieldset
                    this.ownerCt.fireEvent('change', this.ownerCt);

                    // Update the text field with the value
                    var textfield = this.up().down('textfield');
                    var step = this.step || 1;
                    var prec = -Math.floor(Math.log(step) / Math.LN10);
                    var value = this.getValue();
                    var asText = parseFloat((value * step).toFixed(prec));
                    textfield.setValue(asText);
                }
            },
            tipText: function(thumb)
            {
                var step = thumb.slider.step || 1;
                var prec = -Math.floor(Math.log(step) / Math.LN10);
                return (thumb.value * step).toFixed(prec);
            }
        },
        {
            xtype:'textfield',
            width: '25%',
            padding: '0 10 5 10',
            listeners: {
                change: function(f)
                {
                    // Fire change event to fieldset
                    this.ownerCt.fireEvent('change', this.ownerCt);

                    // Update the position of the slider to match
                    var slider = this.up().down('slider');
                    var step = slider.step || 1;
                    slider.setValue(f.value / step);
                }
            }
        }
    ],


    getValue: function()
    // ------------------------------------------------------------------------
    //   Return textfield value in a json object
    // ------------------------------------------------------------------------
    {
        var slider = this.down('slider');
        var step = this.step || 1;
        var value = slider.getValue() * step;
        return value;
    },


    setValue: function(value)
    // ------------------------------------------------------------------------
    //   Set textfield values according to a json object
    // ------------------------------------------------------------------------
    {
        var slider = this.down('slider');
        var step = this.step || 1;
        if (value.hasOwnProperty('step'))
            this.step = step = value.step;
        if (value.hasOwnProperty('min'))
            this.min = value.min;
        if (value.hasOwnProperty('max'))
            this.max = value.max;
        if (value.hasOwnProperty('value'))
            value = value.value;
        slider.step = step;
        if (this.hasOwnProperty('min'))
            slider.setMinValue(this.min / step);
        if (this.hasOwnProperty('max'))
            slider.setMaxValue(this.max / step);
        slider.setValue(value / step);

        var textfield = this.down('textfield');
        var prec = -Math.floor(Math.log(step) / Math.LN10);
        textfield.setValue(value.toFixed(prec));
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
        var slider = this.down('slider');
        var step = this.step || 1;
        var prec = -Math.floor(Math.log(step) / Math.LN10);
        var json = parseFloat((slider.getValue() * step).toFixed(prec));
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
