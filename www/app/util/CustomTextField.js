Ext.define('TE.util.CustomTextField', {
    extend: 'Ext.form.FieldSet',
    requires:['Ext.form.field.Text'],
    alias: 'widget.te_textfield',
    collapsible: true,
    collapsed:true,
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

    getValue: function()
    {
        return this.items.items[0].getValue();
    },

    toJSON: function()
    {
        return Ext.encode(this.getValue());
    },

    setValue: function(value)
    {
        this.items.items[0].setValue(value);
    }
});
