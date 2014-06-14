// ****************************************************************************
//  Item.js                                                        Tao project
// ****************************************************************************
//
//   File Description:
//
//     A single item in an Items item list
//
//
//
//
//
//
//
//
// ****************************************************************************
//  (C) 2014 Christophe de Dinechin <christophe@taodyne.com>
//  (C) 2014 Jérôme Forissier <jerome@taodyne.com>
//  (C) 2014 Catherine Burvelle <cathy@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

Ext.define('TE.util.Item', {
// ----------------------------------------------------------------------------
//   A single item
// ----------------------------------------------------------------------------
    extend:'Ext.form.FieldSet',
    alias: 'widget.te_item',
    layout: 'vbox',
    items: [],
    extraSaveData: {},


    toJSON: function()
    // ------------------------------------------------------------------------
    //   Override toJSON method to save the fields
    // ------------------------------------------------------------------------
    {
        var dynamic = Ext.getCmp('dynamic');
        return dynamic.toJSONItems(this);
    },


    parseJSON: function(json)
    // ------------------------------------------------------------------------
    //   Override parseJSON method
    // ------------------------------------------------------------------------
    {
        var obj = json;
        if (typeof obj == 'string')
            obj = JSON.parse(obj);
        var dynamic = Ext.getCmp('dynamic');
        this.extraSaveData = {}
        dynamic.addItem(obj, this);
    },


    setValue: function(json)
    // ------------------------------------------------------------------------
    //   Set the value of the field
    // ------------------------------------------------------------------------
    {
        return this.parseJSON(json);
    },


    getValue: function()
    // ------------------------------------------------------------------------
    //   Return the value of an item
    // ------------------------------------------------------------------------
    {
        return this.toJSON();
    }
});
