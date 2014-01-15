Ext.define('TE.util.CustomDisplayField', {
    extend: 'Ext.form.FieldSet',
    requires:['Ext.form.field.Display'],
    alias: 'widget.te_displayfield',
    maxHeight:100,
    autoScroll:true,
    collapsible: true,
    collapsed:true,
    index:'',
    items: [ {
        xtype:'displayfield',
        height:100,

        initComponent: function() {
            this.callParent(arguments);
            this.submitValue = true;
        },
        listeners: {
            change: function(f) {
                this.ownerCt.fireEvent('change', this.ownerCt);
            },
            render: function(f) {
                // Use same name that fieldset for form
                f.name = f.ownerCt.name;
            }
        },
    }
    ],
    listeners: {
        render: function(f) {
            f.getEl().on('click',
                         function() { this.fireEvent('click', f); }, f);
        },
    },

    // Update index of fieldset
    setIndex: function(index)
    {
        this.index = index;
    },

    // Return displayfield value in a json object
    getValue: function()
    {
        return this.items.items[0].getValue();
    },

    // Set displayfield according to a json object
    setValue: function(value)
    {
        this.items.items[0].setValue(value);
    },

    // Override toJSON method
    toJSON: function()
    {
        return Ext.encode(this.getValue());
    },

});
