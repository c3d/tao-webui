Ext.define('TE.util.CustomPageMenu', {
    extend: 'Ext.menu.Menu',
    activated: 'all',

    getValue: function()
    // ------------------------------------------------------------------------
    //  Return displayfield value in a json object
    // ------------------------------------------------------------------------
    {
        return this.activated;
    },


    setValue: function(value)
    // ------------------------------------------------------------------------
    // Set displayfield according to a json object
    // ------------------------------------------------------------------------
    {
        this.activated = value;
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    // Override toJSON method
    // ------------------------------------------------------------------------
    {
        return Ext.encode(this.getValue());
    }
});
