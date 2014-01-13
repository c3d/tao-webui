Ext.define('TE.util.CustomDisplayField', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.te_displayfield',

    fieldStyle: {
        borderStyle: 'solid',
        borderColor: '#DCC',
        borderWidth: '1px',
        height: '100px',
        overflow: 'scroll'
    },

    initComponent: function() {
        this.callParent(arguments);
        this.submitValue = true;
    },

    listeners: {
        render: function(f) {
            f.getEl().on('click',
                         function() { this.fireEvent('click', f); }, f);
        }
    },

    toJSON: function()
    {
        return Ext.encode(this.getValue());
    },
});
