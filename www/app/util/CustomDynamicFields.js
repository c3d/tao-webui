Ext.define('TE.util.CustomDynamicFields', {
    extend:'Ext.form.FieldContainer',
    alias: 'widget.te_customdynamicfields',
    requires: ["TE.util.CustomPictureField",
               "TE.util.CustomMovieField",
               "TE.util.CustomTextField"],
    id:"dynamic",
    name:"dynamic",
    layout: 'vbox',
    text_idx:0,   // Current ID of text boxes
    img_idx:0,    // Current ID of pictures
    movie_idx: 0, // Current ID of movies
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
    listeners: {
        remove: function(me, field) { this.removeField(field); }
    },

    // Add new field to this container
    addField: function(type, label, value, collapse)
    {
        var field = this.createField(type, label);
        if(field)
        {
            this.add(field);

            // Use setValue method
            // to update all fields
            field.setValue(value);

            // Add remove button
            this.addRemoveButton(field);

            // Expand fieldset if needed (first add)
            if(!collapse)
                field.expand();
        }
    },

    // Create a field from given type
    createField: function(type, label)
    {
        switch(type)
        {
            case 'title':
            case 'subtitle':
                return this.createCustomTextField(type, label);
            case 'text':
            case 'story':
            case 'left_column':
            case 'right_column':
                return this.createCustomDisplayField(type, label);
            case 'picture':
            case 'left_picture':
            case 'right_picture':
                return this.createCustomPictureField(type, label);
            case 'movie':
            case 'left_movie':
            case 'right_movie':
                return this.createCustomMovieField(type, label);
            case 'chart':
                return this.createCustomChartEditor(type, label);
            default: return;
        }
    },

    // Remove field from container
    // and update all indexes
    removeField: function(field)
    {
        // If removed field contains id, then
        // update label/name of all others fields
        // with same type
        if(field.name.search(/_[0-9]+/g) != -1)
        {
            var items = this.items.items;
            var index = 0;
            Ext.each(items, function(item) {
                if(item.xtype == field.xtype)
                {
                    // Update item index if
                    // necessary
                    index++;
                    item.setIndex(index);
                }
            })
        }

        // Then resave fields
        this.saveDynamicFields();
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


    // Add remove button to field legend
    addRemoveButton: function(field)
    {
        if (!field.legend.closable) {
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

    // Save all dynamic fields to hidden field
    saveDynamicFields: function()
     {
        // Convert object to string
        var string = Ext.encode(this);

        // Save string in hidden field (as we can't serialize dynamic fields)
        var dynamic = Ext.getCmp('dynamicfields');
        dynamic.setValue(string);
    },

    // Override toJSON method
    toJSON: function()
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
    parseJSON: function(json)
    {
        if(!json || json == '')
            return;

        // Decode JSON string
        var items = Ext.decode(json);

        for(var name in items)
        {
            var value = items[name];
            if(value && value != '')
            {
                // Get field type by remove id part (in the form 'TYPE_ID')
                var type = name.replace(/_[0-9]+/g,'');
                // // Get correct field label from menu 'Add...'
                var label = Ext.ComponentQuery.query('[id='+ type +']')[0].text;
                // // Add field
                this.addField(type, label, value, true);
            }
        }
    },

    // Create a textfield
    createCustomTextField: function(type, label)
    {
        // Check if field already exists
        if(this.isExist(type))
            return;

        var fieldLabel = label; // Use same label
        var fieldName  = type;  // Use type as name

        var field = new TE.util.CustomTextField({
            title: fieldLabel,
            name: fieldName,
            index:0,
            width: '100%',
            listeners: {
                change: function() {
                    // Save when field change
                    Ext.getCmp("dynamic").saveDynamicFields();
                },
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
            separator:'_',
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
            separator:'_',
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
                    f.getEl().on('click',
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
        if(this.isExist(type))
            return;

        var fieldLabel = label; // Use same label
        var fieldName  = type;  // Use type as name

        // Create CustomDisplayField
        var field = new TE.util.CustomChartEditor({
            name: fieldName,
            title: fieldLabel,
            index:0,
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
