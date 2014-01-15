Ext.define('TE.util.CustomTextField', {
    extend: 'Ext.form.FieldSet',
    requires:['Ext.form.field.Text'],
    alias: 'widget.te_textfield',
    collapsible: true,
    collapsed:true,
    index:'',
    items: [{
        xtype:'textfield',
        anchor:'100%',
        allowBlank: false,
        msgTarget: 'under',
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

    // Update index of fieldset
    setIndex: function(index)
    {
        this.index = index;
    },

    // Return textfield value in a json object
    getValue: function()
    {
        return this.items.items[0].getValue();
    },

    // Set textfield values according to a json object
    setValue: function(value)
    {
        this.items.items[0].setValue(value);
    },

    // Override toJSON method to encode only textfield value.
    toJSON: function()
    {
        return Ext.encode(this.getValue());
    },
});
