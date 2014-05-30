Ext.define('TE.util.CustomMovieField', {
    extend:'TE.util.CustomFieldSet',
    alias: 'widget.te_custommoviefield',
    collapsible: true,
    collapsed:false,

    initComponent: function()
    // ------------------------------------------------------------------------
    //   Initialize the component for a movie
    // ------------------------------------------------------------------------
    {
        var me = this;
        var index = this.name.replace(/.*(_[0-9]+)/, '$1');
        if (index == this.name)
            index = '';

        Ext.apply(me, {
            items: [{
                xtype: 'temoviepickerfield',
                name: 'url' + index,
                labelAlign:'top',
                fieldLabel: tr('Movie', 'common'),
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'scale' + index,
                labelAlign:'top',
                fieldLabel: tr('Movie scale (%)', 'common'),
                allowBlank: false,
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'x' + index,
                labelAlign:'top',
                fieldLabel: tr('Movie horizontal position', 'common'),
                allowBlank: false,
                anchor:'100%'
            },
            {
                xtype: 'numberfield',
                name: 'y' + index,
                labelAlign:'top',
                fieldLabel: tr('Movie vertical position', 'common'),
                allowBlank: false,
                anchor:'100%'
            }],
        });
        me.callParent( arguments );
    }
});
