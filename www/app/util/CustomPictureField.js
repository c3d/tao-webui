

Ext.define('TE.util.CustomPictureField', {
    extend:'Ext.form.FieldSet',
    alias: 'widget.te_custompicturefield',
    collapsible: true,
    collapsed:true,
    separator:'',
    index: '', // Define additionnal index in order to make each item unique
    defaultValues:['', 100, 0, 0], // Define default values for all fields
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            items: [{
                xtype: 'teimagepickerfield',
                name: 'picture' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Picture', 'common'),
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'picscale' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Picture scale (%)', 'common'),
                allowBlank: false,
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'picx' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Picture horizontal position', 'common'),
                allowBlank: false,
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'picy' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Picture vertical position', 'common'),
                allowBlank: false,
                anchor:'100%'
            }],
        });
        me.callParent( arguments );

        // Set default values
        Ext.each(me.items.items, function(item, index) {
            item.setValue(me.defaultValues[index]);
        });
    },

    // Update index of fieldset
    setIndex: function(index)
    {
        var me = this;
        me.index = index;

        // We need also to update fields names as they depends
        // of the index
        Ext.each(me.items.items, function(item)
        {
            // Get name part without ID
            var name = item.name.replace(/_[0-9]+/g,'');
            // Update field name
            item.name = name + me.separator + me.index;
        });
    },

    // Return all values of chart in a json object
    getValue: function()
    {
        var result = '{';
        var items = this.items.items;
        Ext.each(items, function(item, index) {
            var value = item.value;

            // Add coma if needed
            if(result != '{')
                result += ',';

            result += '"' + item.name + '":' + Ext.encode(value) + '';
        });
        result+='}';
        return result;
    },

    // Set all values according to a json object
    setValue: function(json)
    {
        if(!json || json == '')
            return;

        var fields = this.items.items;
        for(var idx in fields)
        {
            var field = fields[idx];
            if(json.hasOwnProperty(field.name))
            {
                var value = json[field.name];
                if(value && value != '')
                    field.setValue(value);
            }
        }
    },

    // Override toJSON method
    toJSON: function()
    {
        return this.getValue();
    }

});