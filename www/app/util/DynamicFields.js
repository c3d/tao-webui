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
        remove: function(me, field) { this.removeField(field); }
    },
    disableSave: false,
    extraSaveData: {},


    addField: function(type, label, value, collapse, model)
    // ------------------------------------------------------------------------
    //   Add new field to this container
    // ------------------------------------------------------------------------
    {
        var field = this.createField(type, label, model);
        if (type.indexOf('_menu') >= 0)
        {
            if (!field)
                field = this.componentExists(type);
            var menu = Ext.getCmp(type);
            menu.add(field.menuItems);
            this.extraSaveData[type] = value;
        }
        else if(field)
        {
            this.add(field);

            // Use setValue method to update all fields
            if (value)
                field.setValue(value);

            // Add remove button
            if (field.multipleAllowed)
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


    createField: function(name, label, model)
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
        var field = Ext.create('TE.fields.' + type, {
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

        // If this was created from an item, record it
        if (model)
            this.models[name] = model;

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
        return this.fieldDefaultLabels[id] || id;
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method to save the fields
    // ------------------------------------------------------------------------
    {
        var json = {};
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
            json._collapsed_ = collapsed;
        if (labels !== {})
            json._labels_ = labels;
        if (this.models != {})
            json._models_ = this.models;
        for (item in this.extraSaveData)
            json[item] = this.extraSaveData[item];

        // Item name for each model
        var itemNames = {};
        var me = this;
        var models = this.models;
        var itemIndex = 1;
 
        // Re-encode the dyanmic fields including _collapsed_ and _labels_
        Ext.each(items, function(item, index) {
            var name = item.name;
            if(name != 'dynamicfields')
            {
                // To encode complex objects, use toJSON method if defined,
                // otherwise encode value directly (e.g. for textfields)
                if(item.toJSON)
                    value = Ext.encode(item);
                else
                    value = Ext.encode(item.getValue());
                
                // Add item to the JSON output
                if (models.hasOwnProperty(name)) {
                    var model = models[name];
                    var itemName = 'item_' + itemIndex;
                    if (itemNames.hasOwnProperty(model)) {
                        itemName = itemNames[model];
                    } else {
                        itemNames[model] = itemName;
                        itemIndex++;
                    }
                    if (!json.hasOwnProperty(itemName))
                        json[itemName] = { model: model };
                    json[itemName][name] = JSON.parse(value);
                } else {
                    json[name] = JSON.parse(value);
                }
            }
        });

        return JSON.stringify(json);
    },


    setValue: function(json, model)
    // ------------------------------------------------------------------------
    //   Set the value of the field
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
            this._labels_ = mergeObjects(this._labels, items._labels_);
        var me = this;
        for(var name in items)
        {
            if (!name.match(/_.*_/))
            {
                var value = items[name];

                function add(name, value)
                {
                    // Check if we have a label in the input value,
                    // otherwise get it from the label of the 'Add...' menu
                    var label = labels[name] || me.defaultLabel(name);

                    // Check if collapsed
                    var collapse = collapsed && collapsed.indexOf(name) >= 0;

                    // Add field
                    me.addField(name, label, value, collapse, model);
                }


                // Check if we have an item with a data model
                if (name.match(/item_[0-9]+/))
                {
                    model = value.model;
                    delete value.model;
                    for (var it in value)
                        add(it, value[it]);
                }
                else
                {
                    add(name, value);
                }
                
            }
        }
        this.disableSave = saveDisabled;
    },


    parseJSON: function(json)
    // ------------------------------------------------------------------------
    //   Override parseJSON method
    // ------------------------------------------------------------------------
    {
        this.setValue(json);
    }
});
