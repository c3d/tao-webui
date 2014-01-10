Ext.define('TE.util.CustomDynamicFields', {
    extend:'Ext.form.FieldContainer',
    alias: 'widget.te_customdynamicfields',
    id:"dynamic",
    name:"dynamic",
    layout: 'vbox',
    items: [{
            xtype: 'hiddenfield',
            id:'dynamicfields',
            name:'dynamicfields',
            value:'toto',
            flex: 1,
            listeners: {
                change: function() {
                    if(this.ownerCt.items.length == 1)
                    {
                        this.ownerCt.parseJSON(this.getValue());
                    }
                }
            }
    }],
    text_idx:0,
    number_idx:0,
    addField: function(type, label, value)
    {
        var field;
        switch(type)
        {
            case 'title':
            case 'subtitle':
                field = this.createTextField(type, label, value);
                break;
            case 'text':
            case 'story':
            case 'leftcolumn':
            case 'rightcolumn':
                field = this.createCustomDisplayField(type, label, value);
                break;
            // case 'chart':
            //     field = this.createCustomChartEditor(type, label, value);
            //    break;
            default: break;
        }

        this.add(field);
    },

    saveDynamicFields: function() {
        // Convert object to string
        var string = JSON.stringify(this);

        // Save string in hidden field (as we can't serialize dynamic fields)
        var dynamic = Ext.getCmp('dynamicfields');
        dynamic.setValue(string);
    },

    toJSON: function() {
        var json = "{";
        var items = this.items.items;
        Ext.each(items, function(item, index) {
            if(item.name != 'dynamicfields')
            {
                var value = item.getValue();
                if(value && value != '')
                {
                    json += '"' + item.name + '":' + Ext.encode(value) + '';
                    // Add a coma except for last item
                    if(index < (items.length - 1))
                        json += ',';
                }
            }
        });
        json += "}";
        return json;
    },

    parseJSON: function(json) {
        if(!json || json == '')
            return;
        // REVISIT: Not sure why two parsing is needed
        var items = JSON.parse(json);
        items = JSON.parse(items);

        for(var name in items)
        {
            var value = items[name];
            if(value && value != '')
            {
                // Get field type (in the form 'TYPE_ID')
                var type = name.split('_')[0];
                // Get correct field label from menu 'Add...'
                var label = Ext.ComponentQuery.query('[id='+ type +']')[0].text;
                // Add field
                this.addField(type, label, value);
            }
        }
    },

    createTextField: function(type, label, value) {
        // Check if field already exists
        if(this.isAlreadyExist(type))
            return;

        var fieldLabel = label;
        var fieldName  = type;

        var field = new Ext.form.field.Text({
            fieldLabel: fieldLabel,
            name: fieldName,
            labelAlign: 'top',
            width: '100%',
            value: value,
            listeners: {
                change: function() {
                    // Save when field change
                    this.ownerCt.saveDynamicFields();
                }
            }
        });

        return field;
    },

    createCustomDisplayField: function(type, label, value) {
        var fieldLabel = '';
        var fieldName  = '';
        // Check if type corresponds to a simple text box
        // or a slide one (story, left_column, etc.).
        if(!type || type == 'text')
        {
            this.text_idx++;
            fieldLabel = 'Text ' + this.text_idx;     // Label is equal to 'Text ID' (for instance, 'Text 3')
            fieldName  = type + '_' + this.text_idx;  // Name is equal to TYPE_ID (for instance, 'text_3')
        }
        else
        {
            // Check if field already exists
            if(this.isAlreadyExist(type))
                return;

            fieldLabel = label; // Use same label
            fieldName  = type;  // Name is equal to type
        }

        // Create CustomDisplayField
        var field = new TE.util.CustomDisplayField({
            fieldLabel: fieldLabel,
            labelAlign: 'top',
            name: fieldName,
            width: '100%',
            value: value,
            listeners: {
                change: function() {
                    // Save when field change
                    this.ownerCt.saveDynamicFields();
                },
                render: function(f) {
                    // Fire click in order to display field in the center pane
                    f.getEl().on('click',
                                 function() { this.fireEvent('click', f); }, f);
                }
            }
        });

        return field;
    },

    createCustomChartEditor: function(type, label, value) {

        // Check if field already exists
        if(this.isAlreadyExist(type))
            return;

        var fieldLabel = label;
        var fieldName  = type;

        // Create CustomDisplayField
        var field = new TE.util.CustomChartEditor({
            name: fieldName,
            title: fieldLabel,
            width: '100%',
            defaults: {
                listeners: {
                    change: function(field, newVal, oldVal) {
                        // Save when field change
                        Ext.getCmp("dynamic").saveDynamicFields();
                    }
                },
            },
        });

        // Use setValue method of chart
        field.setValue(value);

        return field;
    },

    isAlreadyExist: function(type)
    {
        // Get all fields with same name
        var fields = Ext.ComponentQuery.query('[name='+ type +']')

        if(fields.length >= 1)
        {
            // If there is already at least a
            //  field defined, then focus it
            fields[0].focus();
            return true;
        }
        return false;
    }
});
