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
    disableSave: false,


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
            if(collapse)
                field.collapse();
            else
                field.expand();

            // Once we are done, save
            this.saveDynamicFields();
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

        // Create new field with the given type and label
        var field = null;
        try
        {
            field = Ext.create('TE.fields.' + type, {
                title: label,
                name: name,
                width: '100%',
                type:type,
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
            });
        }
        catch(e)
        {
            console.log("Unknown field type: " + type);
            console.log("Error: " + e);
        }

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
        if (!this.disableSave)
        {
            // Convert object to string
            var string = Ext.encode(this);

            // Save string in hidden field
            var dynamic = Ext.getCmp('dynamicfields');
            dynamic.setValue(string);
        }
    },


    defaultLabel: function(id)
    // ------------------------------------------------------------------------
    //   Return the default label for the given type id
    // ------------------------------------------------------------------------
    {
        var component = Ext.ComponentQuery.query('[id='+id+']');
            if (component && component.length == 1)
                return component[0].text;
        return 'Uknown field type ' + id;
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method to save the fields
    // ------------------------------------------------------------------------
    {
        var json = "{";
        function add(txt)
        {
            // Add comma if not first itme
            if (json != "{")
                json += ',';
            json += txt;
        }


        var items = this.items.items;

        // Compute the "collapsed" and "labels" states
        var collapsed = [];
        var labels = { };
        var me = this;
        Ext.each(items, function(item, index) {
            if (item.collapsed)
                collapsed.push(item.name);
            if (item.title != me.defaultLabel(item.type))
                labels[item.name] = item.title;
        });
        if (collapsed !== [])
            add('"_collapsed_":' + JSON.stringify(collapsed));
        if (labels !== {})
            add('"_labels_":' + JSON.stringify(labels));

        // Re-encode the dyanmic fields including _collapsed_ and _labels_
        Ext.each(items, function(item, index) {
            if(item.name != 'dynamicfields')
            {
                // To encode complex objects, use toJSON method if defined,
                // otherwise encode value directly (e.g. for textfields)
                if(item.toJSON)
                    value = Ext.encode(item);
                else
                    value = Ext.encode(item.getValue());
                
                // Add coma if not first item
                add('"' + item.name + '":' + value);
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

        // Disable saves to hidden field while we are reading it
        var saveDisabled = this.disableSave;
        this.disableSave = true;

        // Decode JSON string
        var items = Ext.decode(json);
        var collapsed = items._collapsed_;
        var labels = items._labels_ || { };
        if (items._labels_)
            this._labels_ = items._labels_;
        for(var name in items)
        {
            if (name != '_collapsed_' && name != '_labels_')
            {
                var value = items[name];

                // Get field type by removing id part (in the form 'TYPE_ID')
                var type = name.replace(/_[0-9]+/g,'');

                // Check if we have a label in the input value,
                // otherwise get it from the label of the 'Add...' menu
                var label = labels[name] || this.defaultLabel(type);

                // Check if collapsed
                var collapse = collapsed && collapsed.indexOf(name) >= 0;

                // Add field
                this.addField(type, label, value, collapse);
            }
        }
        this.disableSave = saveDisabled;
    }
});
