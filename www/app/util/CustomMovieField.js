

Ext.define('TE.util.CustomMovieField', {
    extend:'Ext.form.FieldSet',
    alias: 'widget.te_custommoviefield',
    collapsible: true,
    collapsed:true,
    separator:'',
    index: '', // Define additionnal index in order to make each item unique
    defaultValues:['', 100, 0, 0], // Define default values for all fields
    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            items: [{
                xtype: 'tevideopickerfield',
                name: 'movie' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Filename, path or URL of video', 'common')
            },
            {
                xtype: 'numberfield',
                name: 'moviescalepercent' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Movie scale (%)', 'common'),
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                name: 'moviex' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Movie horizontal position', 'common'),
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                name: 'moviey' + this.separator + this.index,
                labelAlign:'top',
                fieldLabel: tr('Movie vertical position', 'common'),
                allowBlank: false
            }],
        });
        me.callParent( arguments );

        // Set default values
        Ext.each(me.items.items, function(item, index) {
            item.setValue(me.defaultValues[index]);
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