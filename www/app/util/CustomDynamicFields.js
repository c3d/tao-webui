Ext.define('TE.util.CustomDynamicFields', {
// ----------------------------------------------------------------------------
//   A dynamic field holding all the properties for a slide
// ----------------------------------------------------------------------------
    extend:'Ext.form.FieldContainer',
    alias: 'widget.te_customdynamicfields',
    requires: [
        "TE.util.CustomPictureField",
        "TE.util.CustomMovieField",
        "TE.util.CustomTextField"
    ],
    id:"dynamic",
    name:"dynamic",
    layout: 'vbox',
    items:
    [{
        xtype: 'hiddenfield',
        id:'dynamicfields',
        name:'dynamicfields',
        flex: 1,
        listeners: {
            change: function()
            {
                // Parse JSON only when container is loaded
                // (i.e no other fields)
                if(this.ownerCt.items.length == 1)
                    this.ownerCt.parseJSON(this.getValue());
            }
        }
    }],
    listeners:
    {
        remove: function(me, field) { this.removeField(field); }
    },


    addField: function(type, label, value, collapse)
    // ------------------------------------------------------------------------
    //   Add new field to this container
    // ------------------------------------------------------------------------
    {
        var field = this.createField(type, label);
        if(field)
        {
            this.add(field);

            // Use setValue method to update all fields
            field.setValue(value);

            // Add remove button
            this.addRemoveButton(field);

            // Expand fieldset if needed (first add)
            if(!collapse)
                field.expand();
        }
    },


    createField: function(type, label)
    // ------------------------------------------------------------------------
    //   Create a field from given type
    // ------------------------------------------------------------------------
    {
        // Check if component already exists
        var existing = null;
        var name = type;
        var index = 0;
        var existing = this.componentExists(type);
        while (existing)
        {
            // If this component kind should exist only once, don't add
            if (!existing.multipleAllowed)
                return null;

            // Increment index and test new name
            index++;
            name = type + '_' + index;
            existing = this.componentExists(name);
        }
        console.log("Creating " + type + " with name " + name);

        // Create new field with the given type and label
        var field = Ext.create('TE.fields.' + type, {
            title: label,
            name: name,
            width: '100%',
            type:type,
            defaults: {
                listeners: {
                    change: function() {
                        // Save when all fields change
                        // (except legend and datasets fields)
                        Ext.getCmp("dynamic").saveDynamicFields();
                    },
                    render: function(f) {
                        // Fire click to display field in the center pane
                        var el = f.getEl();
                        el.on('click',
                              function() { this.fireEvent('click', f); }, f);
                    }
                }
            }
        });

        return field;
    },


    removeField: function(field)
    // ------------------------------------------------------------------------
    //   Remove field from container - Save new state to dynamic fields
    // ------------------------------------------------------------------------
    {
        // Resave fields
        this.saveDynamicFields();
    },


    componentExists: function(name)
    // ------------------------------------------------------------------------
    //    Check if a component with same name exists
    // ------------------------------------------------------------------------
    {
        // Get all fields with same name
        var fields = Ext.ComponentQuery.query('[name='+ name +']')

        if(fields.length >= 1)
        {
            // If there is already at least a field defined, then focus it
            fields[0].focus();
            return fields[0];
        }
        return null;
    },


    addRemoveButton: function(field)
    // ------------------------------------------------------------------------
    //   Add remove button to field legend
    // ------------------------------------------------------------------------
    {
        if (!field.legend.closable)
        {
            field.legend.insert(0, Ext.widget('tool', {
                type: 'close',
                handler: function() {
                    if (this.ownerCt) {
                        this.ownerCt.remove(this, true);
                    }
                },
                scope: field
            }));
            field.legend.closable = true;
        }
    },


    saveDynamicFields: function()
    // ------------------------------------------------------------------------
    //   Save all dynamic fields to hidden field
    // ------------------------------------------------------------------------
    {
        // Convert object to string
        var string = Ext.encode(this);

        // Save string in hidden field (as we can't serialize dynamic fields)
        var dynamic = Ext.getCmp('dynamicfields');
        dynamic.setValue(string);
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method to save the fields
    // ------------------------------------------------------------------------
    {
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

                    // To encode complex objects, use toJSON method if defined,
                    // otherwise encode value directly (e.g. for textfields)
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


    parseJSON: function(json)
    // ------------------------------------------------------------------------
    //   Override parseJSON method
    // ------------------------------------------------------------------------
    {
        if(!json || json == '')
            return;

        function defaultLabel(id)
        {
            return Ext.ComponentQuery.query('[id='+id+']')[0].text;
        }

        // Decode JSON string
        var items = Ext.decode(json);
        for(var name in items)
        {
            var value = items[name];
            if(value && value != '')
            {
                // Get field type by removing id part (in the form 'TYPE_ID')
                var type = name.replace(/_[0-9]+/g,'');

                // Check if we have a label in the input value,
                // otherwise get it from the label of the 'Add...' menu
                var label = value.label || defaultLabel(type);

                // // Add field
                this.addField(type, label, value, true);
            }
        }
    },


    createCustomTextField: function(type, label)
    // ------------------------------------------------------------------------
    // Create a textfield
    // ------------------------------------------------------------------------
    {
        // Check if field already exists
        if(this.componentExists(type))
            return;

        var fieldLabel = label; // Use same label
        var fieldName  = type;  // Use type as name

        var field = new TE.util.CustomTextField({
            title: fieldLabel,
            name: fieldName,
            width: '100%',
            listeners: {
                change: function() {
                    // Save when field change
                    Ext.getCmp("dynamic").saveDynamicFields();
                }
            }
        });

        return field;
    },


    // Create a picture field
    createCustomPictureField: function(type, label)
    {
        // Increase index to have unique attributes
        this.img_idx++;

        var fieldLabel = label; // Add id to label
        var fieldName  = type + '_' + this.img_idx;  // Add id to name

        var field = new TE.util.CustomPictureField({
            title: fieldLabel,
            name: fieldName,
            width: '100%',
            index:this.img_idx,
            type:type,
            defaults: {
                listeners: {
                    change: function() {
                        // Save when all fields change
                        // (except legend and datasets fields)
                        Ext.getCmp("dynamic").saveDynamicFields();
                    },
                },
            },

        });

        return field;
    },

    // Create a movie field
    createCustomMovieField: function(type, label)
    {
        // Increase index to have unique attributes
        this.movie_idx++;

        var fieldLabel = label;
        var fieldName  = type + '_' + this.movie_idx;  // Add id to name

        var field = new TE.util.CustomMovieField({
            title: fieldLabel,
            name: fieldName,
            width: '100%',
            index:this.movie_idx,
            type:type,
            defaults: {
                listeners: {
                    change: function() {
                        // Save when all fields change
                        // (except legend and datasets fields)
                        Ext.getCmp("dynamic").saveDynamicFields();
                    },
                },
            },
        });

        return field;
    },

    // Create display field
    createCustomDisplayField: function(type, label)
    {
        var fieldLabel = '';
        var fieldName  = '';

        // Check if type corresponds to a simple text box
        // or a slide component (story, left_column, etc.).
        if(!type || type == 'text')
        {
            // Case of text box, define new label and name
            this.text_idx++;
            fieldLabel = 'Text';

            // Name is equal to TYPE_ID (for instance, 'text_3')
            fieldName  = type + '_' + this.text_idx;
        }
        else
        {
            // Check if component already exists
            if(this.componentExists(type))
                return;

            fieldLabel = label; // Use same label
            fieldName  = type;  // Use type as name
        }

        // Create CustomDisplayField
        var field = new TE.util.CustomDisplayField({
            title: fieldLabel,
            name: fieldName,
            width: '100%',
            listeners: {
                change: function() {
                    // Save when field change
                    Ext.getCmp("dynamic").saveDynamicFields();
                },
                render: function(f) {
                    // Fire click in order to display field in the center pane
                    var el = f.getEl();
                    el.on('click',
                          function() { this.fireEvent('click', f); }, f);
                }
            }
        });

        return field;
    },

    // Create chart editor
    createCustomChartEditor: function(type, label)
    {
        // Check if field already exists
        if(this.componentExists(type))
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
                    change: function() {
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

        return field;
    },
});
