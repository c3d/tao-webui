Ext.define('TE.util.TextureField', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.te_texturefield',
    collapsible: true,
    collapsed:false,
    items: [{
        xtype:'teimagepickerfield',
        anchor:'100%',
        allowBlank: false,
        listeners: {
            change: function(f) {
                // Fire change event to fieldset
                this.ownerCt.fireEvent('change', this.ownerCt);
            },
            render: function(f) {
                // Use same name that fieldset for form
                f.name = f.ownerCt.name;
            }
        },
    }],



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


    getValue: function()
    // ------------------------------------------------------------------------
    //   Return textfield value in a json object
    // ------------------------------------------------------------------------
    {
        return this.items.items[0].getValue();
    },


    setValue: function(value)
    // ------------------------------------------------------------------------
    //   Set textfield values according to a json object
    // ------------------------------------------------------------------------
    {
        if (value.hasOwnProperty('value'))
            value = value.value;
        else if (value.hasOwnProperty('texture'))
            value = value.texture;
        this.items.items[0].setValue(value);
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method to encode only textfield value.
    // ------------------------------------------------------------------------
    {
        return Ext.encode(this.getValue());
    }
});
