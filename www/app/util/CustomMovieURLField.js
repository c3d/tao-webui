Ext.define('TE.util.CustomMovieURLField', {
    extend: 'Ext.form.FieldSet',
    alias: 'widget.te_custommovieurlfield',
    collapsible: true,
    collapsed:false,
    items: [{
        xtype:'tevideopickerfield',
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