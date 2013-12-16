
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
        border: false,
        this.lastFocus = null,
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
                fieldLabel: tr('Chart x-label', 'common'),
                name: 'chartxlabel',
                id: 'chartxlabel',
                xtype: 'textfield',
                labelAlign: 'top',
                width:'100%',
                emptyText: "x-axis",
            },
            {
                fieldLabel: tr('Chart y-label', 'common'),
                name: 'chartylabel',
                xtype: 'textfield',
                labelAlign: 'top',
                width:'100%',
                emptyText: "y-axis",
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
                    {header: 'A', width: 100, dataIndex: 'a', field: 'textfield'},
                    {header: 'B', width: 100, dataIndex: 'b', field: 'textfield'},
                    {header: 'C', width: 250, dataIndex: 'c', field: 'textfield'},
                    {header: 'D', width: 250, dataIndex: 'd', field: 'textfield'}
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
                },
                listeners: {
                    viewReady: function(grid)
                    {
                        // Need to redefine viewReady events as it is overrided by
                        // listeners declaration
                        TE.util.CustomGridEditor.prototype.createKeysMap(grid);
                    },
                    itemmousedown: function()
                    {
                        var grid = this.ownerCt;
                        var lastFocus = grid.lastFocus;

                        if(lastFocus)
                        {
                            var recs = this.getSelectionModel().getSelection();

                            if(lastFocus.name == 'chartlegend') // Update legend if coresponding field is the last focus
                            {
                                // Parse selected cells and save it to an excell form ($A$1;$A2;etc.)
                                var legend = '';
                                for(var i = 0; i < recs.length; i++)
                                {
                                    var dataIndex = recs[i].position.dataIndex.toUpperCase();
                                    var row = recs[i].position.row + 1;
                                    legend += '$' + dataIndex + '$' + row + ';';
                                }

                                // Update legend field
                                Ext.getCmp('chartlegend').setValue(legend);
                            }
                            else if(lastFocus.name == 'chartdatasets') // Update legend if coresponding field is the last focus
                            {
                                // Parse all selected columns
                                var datasetsIndexes = [];
                                var datasets = '';
                                for(var i = 0; i < recs.length; i++)
                                    datasetsIndexes[i] = recs[i].position.dataIndex.toUpperCase();

                                // Remove duplicate
                                datasetsIndexes = Ext.Array.unique(datasetsIndexes);

                                // Save it to an excell form (A;B;etc.)
                                for(var i = 0; i < datasetsIndexes.length; i++)
                                    datasets += datasetsIndexes[i] + ';';

                                // Update field
                                Ext.getCmp('chartdatasets').setValue(datasets);
                            }
                        }
                    }
                }
            },
            {
                fieldLabel: tr('Chart legend', 'common'),
                name: 'chartlegend',
                id:'chartlegend',
                xtype: 'textfield',
                labelAlign: 'top',
                width:'100%',
                emptyText: "",
                listeners: {
                    focus: function() {
                        // Update last focused item
                        this.ownerCt.lastFocus = this;
                    },
                },
            },
            {
                fieldLabel: tr('Chart drawing datasets', 'common'),
                name: 'chartdatasets',
                id:'chartdatasets',
                xtype: 'textfield',
                labelAlign: 'top',
                width:'100%',
                emptyText: "",
                listeners: {
                    focus: function() {
                        // Update last focused item
                        this.ownerCt.lastFocus = this;
                    },
                },
            }
        ]

        // As there is no blur event for grid, check when
        // mousedown event is outside the grid.
        Ext.getDoc().on("mousedown", function(e) {
            var chartgrid  = Ext.getCmp('chartgrid');
            var chart      = Ext.getCmp('chart');
            if(chart.lastFocus && !e.within(chartgrid.getEl()))
            {
                chart.lastFocus = null;
                chartgrid.getSelectionModel().allCellDeselect();
            }
        });

        this.callParent(this);
    }
});