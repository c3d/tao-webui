Ext.define('TE.util.CustomPictureField', {
    extend:'TE.util.CustomFieldSet',
    alias: 'widget.te_custompicturefield',

    initComponent: function()
    // ------------------------------------------------------------------------
    //   Initialize the component for a picture
    // ------------------------------------------------------------------------
    {
        var me = this;
        var index = this.name.replace(/.*(_[0-9]+)/, '$1');
        if (index == this.name)
            index = '';

        Ext.apply(me, {
            items: [{
                xtype: 'teimagepickerfield',
                name: 'url' + index,
                labelAlign:'top',
                fieldLabel: tr('Picture', 'common'),
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'scale' + index,
                labelAlign:'top',
                fieldLabel: tr('Picture scale (%)', 'common'),
                allowBlank: false,
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'x' + index,
                labelAlign:'top',
                fieldLabel: tr('Picture horizontal position', 'common'),
                allowBlank: false,
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'y' + index,
                labelAlign:'top',
                fieldLabel: tr('Picture vertical position', 'common'),
                allowBlank: false,
                anchor:'100%'
            }],
        });
        me.callParent( arguments );
    }
});
