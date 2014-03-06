Ext.define('TE.util.CustomFieldSet', {
    extend:'Ext.form.FieldSet',
    alias: 'widget.te_customfieldset',
    collapsible: true,
    collapsed:true,

    getValue: function()
    // ------------------------------------------------------------------------
    //   Return all values of chart in a json object
    // ------------------------------------------------------------------------
    {
        var result = '{';
        var items = this.items.items;
        Ext.each(items, function(item, index) {
            var value = item.value;

            // Add coma if needed
            if(result != '{')
                result += ',';

            // Remove _123 from the name in case of multiple fields
            var name = item.name.replace(/_[0-9]+/, '')
            result += '"' + name + '":' + Ext.encode(value) + '';
        });
        result+='}';
        return result;
    },


    setValue: function(json)
    // ------------------------------------------------------------------------
    //   Set all values according to a json object
    // ------------------------------------------------------------------------
    {
        if(!json || json == '')
            return;

        var fields = this.items.items;
        for(var idx in fields)
        {
            var field = fields[idx];
            var fname = field.name.replace(/_[0-9]+/, '');
            if(json.hasOwnProperty(fname))
            {
                var value = json[fname];
                field.setValue(value);
            }
        }
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method
    // ------------------------------------------------------------------------
    {
        return this.getValue();
    }

});
