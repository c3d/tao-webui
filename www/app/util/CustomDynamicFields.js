Ext.define('TE.util.CustomDynamicFields', {
    extend:'Ext.form.FieldContainer',
    alias: 'widget.te_customdynamicfields',
    requires: ["TE.util.MultiCellSelectionModel", "TE.util.CustomPictureField"],
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
                    // Parse json only when container is loaded (i.e no other fields)
                    if(this.ownerCt.items.length == 1)
                        this.ownerCt.parseJSON(this.getValue());
                }
            }
    }],
    text_idx:0,
    number_idx:0,
    img_idx:0,

    // Add new field to this container
    addField: function(type, label, value)
    {
        switch(type)
        {
            case 'title':
            case 'subtitle':
                this.createTextField(type, label, value);
                break;
            case 'text':
            case 'story':
            case 'leftcolumn':
            case 'rightcolumn':
                this.createCustomDisplayField(type, label, value);
                break;
            case'picture':
            case'leftpicture':
            case'rightpicture':
                this.createCustomPictureField(type, label, value);
                break;
            case 'chart':
                this.createCustomChartEditor(type, label, value);
               break;
            default: break;
        }

    },

    // Save all dynamic fields to hidden field
    saveDynamicFields: function() {
        // Convert object to string
        var string = Ext.encode(this);

        // Save string in hidden field (as we can't serialize dynamic fields)
        var dynamic = Ext.getCmp('dynamicfields');
        dynamic.setValue(string);
    },

    // Override toJSON method
    toJSON: function() {
        var json = "{";
        var items = this.items.items;
        Ext.each(items, function(item, index) {
            if(item.name != 'dynamicfields')
            {
                var value = item.getValue();
                if(value && value != '')
                {
                    // Add coma if not first item
                    if(json != '{')
                        json += ',';

                    json += '"' + item.name + '":';

                    // To encode complex objects, use implicitly
                    // toJSON method if defined.
                    // Otherwise encode directly value
                    // (notably for simple objects like textfields).
                    if(item.toJSON)
                        json += Ext.encode(item);
                    else
                        json += Ext.encode(value);
                }
            }
        });
        json += "}";
        return json;
    },

    // Override parseJSON method
    parseJSON: function(json) {
        if(!json || json == '')
            return;
        var items = Ext.decode(json);

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

    // Create a textfield
    createTextField: function(type, label, value) {
        // Check if field already exists
        if(this.isExist(type))
            return;

        var fieldLabel = label; // Use same label
        var fieldName  = type;  // Use type as name

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

        this.add(field);
    },

    // Create a picture field
    createCustomPictureField: function(type, label, value)
    {
        var newIndex = this.computeNewIndex(type);
        var fieldLabel = label + ' ' + newIndex; // Add id to label
        var fieldName  = type + '_' + newIndex;  // Add id to name

        // Increase index to have unique attributes
        this.img_idx++;

        var field = new TE.util.CustomPictureField({
            title: fieldLabel,
            name: fieldName,
            width: '100%',
            index:this.img_idx,
            separator:'_',
            type:type,
            defaults: {
                listeners: {
                    change: function(field, newVal, oldVal) {
                        // Save when all fields change
                        // (except legend and datasets fields)
                        Ext.getCmp("dynamic").saveDynamicFields();
                    },
                },
            },
        });

        this.add(field);

        // Use setValue method
        // to update all fields
        field.setValue(value);
    },

    // Create display field
    createCustomDisplayField: function(type, label, value) {
        var fieldLabel = '';
        var fieldName  = '';

        // Check if type corresponds to a simple text box
        // or a slide component (story, left_column, etc.).
        if(!type || type == 'text')
        {
            // Case of text box, define new label and name
            this.text_idx++;
            fieldLabel = 'Text ' + this.text_idx;     // Label is equal to 'Text ID' (for instance, 'Text 3')
            fieldName  = type + '_' + this.text_idx;  // Name is equal to TYPE_ID (for instance, 'text_3')
        }
        else
        {
            // Check if component already exists
            if(this.isExist(type))
                return;

            fieldLabel = label; // Use same label
            fieldName  = type;  // Use type as name
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

        this.add(field);
    },

    // Create chart editor
    createCustomChartEditor: function(type, label, value) {

        // Check if field already exists
        if(this.isExist(type))
            return;

        var fieldLabel = label; // Use same label
        var fieldName  = type;  // Use type as name

        // Create CustomDisplayField
        var field = new TE.util.CustomChartEditor({
            name: fieldName,
            title: fieldLabel,
            width: '100%',
            defaults: {
                listeners: {
                    change: function(field, newVal, oldVal) {
                        // Save when all fields change
                        // (except legend and datasets fields)
                        Ext.getCmp("dynamic").saveDynamicFields();
                    },
                },
            },
            listeners: {
                change: function()
                {
                    // Need to handle change event this way for
                    // legend and datasets fields as we have
                    // redefined listeners (for focus event).
                    Ext.getCmp("dynamic").saveDynamicFields();
                }
            }
        });

        this.add(field);

        // Don't know why but need to redefine plugin
        // of chart grid otherwise edit event is not fired
        var grid = Ext.getCmp("chartgrid");
        grid.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2,
            pluginId: 'cellEditing',
            listeners: {
                edit: function() {
                    this.grid.updateData();
                }
            }
        })];

        // Use setValue method
        // to update all fields
        field.setValue(value);
    },

    // Check if a component with same name exists
    isExist: function(name)
    {
        // Get all fields with same name
        var fields = Ext.ComponentQuery.query('[name='+ name +']')

        if(fields.length >= 1)
        {
            // If there is already at least a
            //  field defined, then focus it
            fields[0].focus();
            return true;
        }
        return false;
    },

    // Compute a new index for element of given type
    computeNewIndex: function(type)
    {
        var fields = Ext.ComponentQuery.query('[type=' + type + ']');
        var previousField = fields[(fields.length - 1)];
        if(previousField)
            return (fields.length + 1);

        return 1;
    }
});
