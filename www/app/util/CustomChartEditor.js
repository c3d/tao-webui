
Ext.define('TE.util.CustomChartEditor', {
    extend:'Ext.form.FieldContainer',
    alias: 'widget.customcharteditor',
    requires:['TE.util.CustomGridEditor'],
    id:"chart",
    name:"chart",

    getChartStyle: function(chart)
    {
        var data=[];
        switch(chart){
            case 'Area':
                data=[["Default"],["Stacked"]];
                break;

            case 'Bar':
                data=[["Default"],["Horizontal"],["Horizontal_stacked"],["Vertical"],["Vertical_stacked"]];
                break;

            case 'Line':
                data=[["Default"],["Line"],["Point"]];
                break;

            case 'Pie':
                data=[["Default"]];
                break;
        }

        return data;
    },

    updateChartStyle: function(clear)
    {
        var types  = Ext.getCmp('charttype');
        var styles = Ext.getCmp('chartstyle');
        var input  = types.getValue();    
        var data   = this.getChartStyle(input);
        styles.store.loadData(this.getChartStyle(input));
        if(clear)
            styles.setValue(data[0]);

    },

    initComponent: function () {

        this.layout = 'vbox';
        border: false,

        this.items = [
            {
                fieldLabel: tr('Chart name', 'common'),
                name: 'chartname',
                xtype: 'textfield',
                labelAlign: 'top',
                width:'100%',
                value:'chart'
            },
            {
                fieldLabel: tr('Chart type', 'common'),
                name: 'charttype',
                id: 'charttype',
                xtype: 'combo',
                labelAlign: 'top',
                queryMode: 'local',
                width:'100%',
                store: new Ext.data.SimpleStore({
                    fields: ['name'],
                    data: [["Area"],["Bar"],["Line"],["Pie"]]
                }),
                displayField : 'name',
                listeners: {
                    select: function(combo, record, index) {
                        var chart = Ext.getCmp('chart');
                        chart.updateChartStyle(true);
                    }
                }
            },
            {
                fieldLabel: tr('Chart style', 'common'),
                name: 'chartstyle',
                id: 'chartstyle',
                xtype: 'combo',
                labelAlign: 'top',
                width:'100%',
                queryMode: 'local',
                triggerAction : 'all',
                store : new Ext.data.SimpleStore( {
                    fields: ['style'],
                    autoLoad: {
                        scope: this,
                        callback: function() {
                            this.updateChartStyle(false);
                        }
                    }
                }),
                emptyText : tr('Select chart style', 'common'),
                displayField : 'style'
            },
            {
                xtype: 'hiddenfield',
                name: 'chartdata',
                id:'chartdata'
            },
            {
                xtype: 'customgrideditor',
                name:'chartgrid',
                id:'chartgrid',
                width: '100%',
                maxHeight: 500,
                columns: [
                    {xtype: 'rownumberer'},
                    {header: 'A', width: 100, dataIndex: 'a', field: 'numberfield'},
                    {header: 'B', width: 100, dataIndex: 'b', field: 'numberfield'},
                    {header: 'C', width: 250, dataIndex: 'c', field: 'numberfield'},
                    {header: 'D', width: 250, dataIndex: 'd', field: 'numberfield'}
                ],
                store: new Ext.data.Store({
                    fields: [
                        {name: 'a'},
                        {name: 'b'},
                        {name: 'c'},
                        {name: 'd'}
                    ],
                    pageSize: 10,
                    autoLoad: true,
                    listeners: {
                        load: function() {
                            var chartdata  = Ext.getCmp('chartdata');
                            var grid  = Ext.getCmp('chartgrid');
                            var jsonData = chartdata.getValue();
                            if(jsonData != '')
                            {
                                var data = Ext.decode(jsonData);
                                grid.getStore().loadData(data);
                            }
                        }
                    }
                }),
	            updateData: function()
			    {
			        // Save current data
			        var data = [];
			        this.store.each(function(r){
			            data.push(r.data);
			        });
			        var jsonData = Ext.encode(data);
			        var chartdata  = Ext.getCmp('chartdata');
			        chartdata.setValue(jsonData);

            		// Force grid refresh to update row numbers
            		this.getView().refresh(true);
			    }
            },
        ]

        this.callParent(this);
    }
});