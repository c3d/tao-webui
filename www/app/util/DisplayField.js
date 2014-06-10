Ext.define('TE.util.DisplayField', {
    extend: 'Ext.form.FieldSet',
    requires:['Ext.form.field.Display'],
    alias: 'widget.te_displayfield',
    maxHeight:100,
    autoScroll:true,
    collapsible: true,
    collapsed:false,
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
                f.multipleAllowed = f.ownerCt.multipleAllowed;
            }
        },
    }
    ],
    listeners: {
        render: function(f) {
            f.getEl().on('click',
                         function() { this.fireEvent('click', f); }, f);

            f.getEl().on('removed',
                         function() { this.fireEvent('removed', f); }, f);
        }
    },

    getValue: function()
    // ------------------------------------------------------------------------
    //  Return displayfield value in a json object
    // ------------------------------------------------------------------------
    {
        return this.items.items[0].getValue();
    },


    setValue: function(value)
    // ------------------------------------------------------------------------
    // Set displayfield according to a json object
    // ------------------------------------------------------------------------
    {
        this.items.items[0].setValue(value);
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    // Override toJSON method
    // ------------------------------------------------------------------------
    {
        return Ext.encode(this.getValue());
    }
});
