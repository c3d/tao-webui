Ext.define('TE.util.DynamicFields', {
// ----------------------------------------------------------------------------
//   A dynamic field holding all the properties for a slide
// ----------------------------------------------------------------------------
    extend:'Ext.form.FieldContainer',
    alias: 'widget.te_dynamicfields',
    name:"dynamic",
    layout: 'vbox',
    models: {},
    items: [{
        xtype: 'hiddenfield',
        name:'dynamicfields',
        flex: 1,
        listeners: {
            change: function()
            {
                // Parse JSON only when container is loaded
                // (i.e no other fields)
                if(this.ownerCt.items.length == 1)
                {
                    this.ownerCt.parseJSON(this.getValue());
                }
            }
        }
    }],
    listeners:
    {
        remove: function(me, field) { this.saveDynamicFields(); }
    },
    disableSave: false,
    extraSaveData: {},


    addItem: function(json, parent)
    // ------------------------------------------------------------------------
    //    Add an item, possibly within an 'Items' component
    // ------------------------------------------------------------------------
    {
        // Disable saves to hidden field while we are reading it
        var saveDisabled = this.disableSave;
        this.disableSave = true;

        // Decode JSON string
        var items = (typeof json == 'string' ? Ext.decode(json) : json);
        var collapsed = items._collapsed_;
        var labels = items._labels_ || { };
        var me = this;
        for(var name in items)
        {
            var value = items[name];
            if (name.match(/^_.*_$/))
            {
                // Record special elements like _label_ or _collapsed_
                // in the 'extraSaveData' field so that we can save it later
                var parentCt = parent || this;
                parentCt.extraSaveData[name] = value;
            }
            else
            {
                // Regular values will cause the creation of a component
                // Check if we have a label in the input value,
                // otherwise get it from the label of the 'Add...' menu
                var label = labels[name] || me.defaultLabel(name);

                // Check if collapsed
                var collapse = collapsed && collapsed.indexOf(name) >= 0;

                
                // Add field
                me.addField(name, label, value, collapse, parent);
            }
        }
        this.disableSave = saveDisabled;
        this.saveDynamicFields();

        return items;
    },


    addFromMenu: function(type, label)
    // ------------------------------------------------------------------------
    //   Add element directly from menu
    // ------------------------------------------------------------------------
    {
        this.addField(type, label);
        this.saveDynamicFields();
    },


    addField: function(type, label, value, collapse, parent)
    // ------------------------------------------------------------------------
    //   Add new field to this container
    // ------------------------------------------------------------------------
    {
        var field = this.createField(type, label);
        var parentCt = parent || this;
        if (type.indexOf('_menu') >= 0)
        {
            if (!field)
                field = this.componentExists(type);
            var menu = Ext.getCmp(type);
            menu.add(field.menuItems);
            parentCt.extraSaveData[type] = value;
        }
        else if (field)
        {
            parentCt.add(field);

            // Use setValue method to update all fields
            if (value)
                field.setValue(value);

            // Add remove button and up/down buttons
            if (field.legend)
            {
                this.addButtons(field, parent);

                // Expand fieldset if needed (first add)
                if(collapse)
                    field.collapse();
                else
                    field.expand();
            }
        }
    },


    createField: function(name, label)
    // ------------------------------------------------------------------------
    //   Create a field from given type
    // ------------------------------------------------------------------------
    {
        // Check if component already exists
        var existing = null;
        var type = name.replace(/_[0-9]+/,'');
        var index = 0;
        var existing = this.componentExists(name);
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
        var me = this;
        var field = Ext.create('TE.fields.' + type, {
            title: label,
            name: name,
            width: '100%',
            type:type,
            listeners: {
                change: function() {
                    // Save when all fields change
                    // (except legend and datasets fields)
                    me.saveDynamicFields();
                },
                render: function(f) {
                    // Fire click to display field in the center pane
                    var el = f.getEl();
                    el.on('click',
                          function() { this.fireEvent('click', f); }, f);
                }
            }
        });

        return field;
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


    addButtons: function(field, parent)
    // ------------------------------------------------------------------------
    //   Add remove button to field legend
    // ------------------------------------------------------------------------
    {
        var dynamic = this;

        if (field.multipleAllowed)
        {
            if (!field.legend.closable)
            {
                var canClose = !parent || parent.type != 'item';
                if (canClose)
                    field.legend.insert(0, Ext.widget('tool', {
                        type: 'close',
                        handler: function() {
                            if (this.ownerCt) {
                                this.ownerCt.remove(this, true);
                                dynamic.saveDynamicFields();
                            }
                        },
                        scope: field
                    }));
                field.legend.closable = true;
            }
        }

        if (!field.orderMustBePreserved)
        {
            if (!field.legend.moveable)
            {
                field.legend.insert(0, Ext.widget('tool', {
                    type: 'moveDown',
                    handler: function() {
                        if (this.ownerCt) {
                            var itemIndex = this.ownerCt.items.indexOf(this);
                            this.ownerCt.move(itemIndex, itemIndex+1);
                            dynamic.saveDynamicFields();
                        }
                    },
                    scope: field
                }));
                field.legend.insert(0, Ext.widget('tool', {
                    type: 'moveUp',
                    handler: function() {
                        if (this.ownerCt) {
                            var itemIndex = this.ownerCt.items.indexOf(this);
                            this.ownerCt.move(itemIndex, itemIndex-1);
                            dynamic.saveDynamicFields();
                        }
                    },
                    scope: field
                }));
                field.legend.moveable = true;
            }
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
            var dynamic = this.down('hiddenfield');
            dynamic.setValue(string);
        }
    },

    
    fieldDefaultLabels:
    // ------------------------------------------------------------------------
    //   Name of the various labels when not explicitly set by .ddt template
    // ------------------------------------------------------------------------
    {
        'picture'       : tr('Picture'),
        'movie'         : tr('Movie'),
        'chart'         : tr('Chart'),
        'title'         : tr('Title'),
        'subtitle'      : tr('Subtitle'),
        'story'         : tr('Story'),
        'items'         : tr('Items')
    },


    defaultLabel: function(id)
    // ------------------------------------------------------------------------
    //   Return the default label for the given type id
    // ------------------------------------------------------------------------
    {
        id = id.replace(/_[0-9]+$/, '');
        return this.fieldDefaultLabels[id] || id;
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method to save the fields
    // ------------------------------------------------------------------------
    {
        return this.toJSONItems(this);
    },


    toJSONItems: function(me)
    // ------------------------------------------------------------------------
    //   Save to JSON, including for children items (see Items.js)
    // ------------------------------------------------------------------------
    {
        var json = {};
        var items = me.items.items;

        // Compute the "collapsed" and "labels" states
        var collapsed = [];
        var labels = { };
        var dynamic = this;
        Ext.each(items, function(item, index) {
            if (item.type)
            {
                if (item.collapsed)
                    collapsed.push(item.name);
                if (item.title != dynamic.defaultLabel(item.type))
                    labels[item.name] = item.title;
            }
        });

        // Save elements that are really not fields
        for (item in me.extraSaveData)
            json[item] = me.extraSaveData[item];

        // Possibly overwrite with computed collapsed and labels states
        if (collapsed != [])
            json._collapsed_ = collapsed;
        else
            delete json._collapsed_;
        if (labels != {})
            json._labels_ = labels;
        else
            delete json._labels_;

        // Re-encode the dynamic fields including _collapsed_ and _labels_
        Ext.each(items, function(item, index) {
            var name = item.name;
            if(item.type)
            {
                // To encode complex objects, use toJSON method if defined,
                // otherwise encode value directly (e.g. for textfields)
                if(item.toJSON)
                    value = Ext.encode(item);
                else
                    value = Ext.encode(item.getValue());
                
                // Add item to the JSON output
                json[name] = JSON.parse(value);
            }
        });

        return JSON.stringify(json);
    },


    setValue: function(json)
    // ------------------------------------------------------------------------
    //   Set the value of the field
    // ------------------------------------------------------------------------
    {
        if(!json || json == '')
            return;
        this.addItem(json);
    },


    parseJSON: function(json)
    // ------------------------------------------------------------------------
    //   Override parseJSON method
    // ------------------------------------------------------------------------
    {
        this.setValue(json);
    }
});
