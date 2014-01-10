
Ext.define('TE.util.CustomChartEditor', {
    extend:'Ext.form.FieldContainer',
    alias: 'widget.customcharteditor',
    requires:['TE.util.CustomGridEditor'],
    id:"chart_container",
    name:"chart_container",

    getChartTypes: function()
    {
        return [{abbr:"Area",   name:tr('Area', 'common'),},
                {abbr:"Bar",   name:tr('Bar', 'common')},
                {abbr:"Line",    name:tr('Line', 'common')},
                {abbr:"Pie",    name:tr('Pie', 'common')}]
    },

    getChartStyles: function(chart)
    {
        var data=[];
        switch(chart){
            case 'Area':
                data=[{abbr:"Default",   name:tr('Default', 'common')},
                      {abbr:"Stacked",   name:tr('Stacked', 'common')}];
                break;

            case 'Bar':
                data=[{abbr:"Horizontal",   name:tr('Horizontal', 'common')},
                      {abbr:"Horizontal_stacked",   name:tr('Horizontal stacked', 'common')},
                      {abbr:"Vertical",   name:tr('Vertical', 'common')},
                      {abbr:"Vertical_stacked",   name:tr('Vertical stacked', 'common')}];
                break;

            case 'Line':
                data=[{abbr:"Line",   name:tr('Line', 'common')},
                      {abbr:"Line&Point",   name:tr('Line & Point', 'common')},
                      {abbr:"Point",   name:tr('Point', 'common')}];
                break;

            case 'Pie':
                data=[{abbr:"Default",   name:tr('Default', 'common')}];
                break;
        }

        return data;
    },


    updateChartStyles: function()
    {
        var types  = Ext.getCmp('charttype');
        var styles = Ext.getCmp('chartstyle');
        var input  = types.getValue();
        var data   = this.getChartStyles(input);
        styles.store.loadData(this.getChartStyles(input));
        styles.setValue(data[0].abbr);
    },

    initComponent: function () {
        border: false,
        this.lastFocus = null,

        this.items = [
            {
                fieldLabel: tr('Chart title', 'common'),
                name: 'charttitle',
                xtype: 'textfield',
                labelAlign: 'top',
                width:'100%',
                value:'chart'
            },
            {
                xtype: 'combobox',
                store: Ext.create('Ext.data.Store', {
                    fields: ['abbr', 'name'],
                    data : this.getChartTypes(),
                    sorters: [{
                        property: 'name',
                        direction: 'ASC'
                    }],
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'abbr',
                editable: false,
                autoSelect: true,
                name: 'charttype',
                id:'charttype',
                fieldLabel: tr('Chart type', 'common'),
                labelAlign: 'top',
                listeners: {
                    select: function(combo, record, index) {
                        Ext.getCmp('chart_container').updateChartStyles();
                    },
                },
            },
            {
                xtype: 'combobox',
                store: Ext.create('Ext.data.Store', {
                    fields: ['abbr', 'name'],
                    data: this.getChartStyles("Bar"),
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'abbr',
                editable: false,
                autoSelect: true,
                name: 'chartstyle',
                id:'chartstyle',
                fieldLabel: tr('Chart style', 'common'),
                labelAlign: 'top',
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
                xtype: 'label',
                text: tr('Chart data:', 'common'),
            },
            {
                xtype: 'customgrideditor',
                name:'chartgrid',
                id:'chartgrid',
                resizable: true,
                width: 500,
                maxHeight: 450,
                minHeight: 450,
                columns: [
                    {xtype: 'rownumberer'},
                    {header: 'A', width: 100, dataIndex: 'a', field: 'textfield', flex:1},
                    {header: 'B', width: 100, dataIndex: 'b', field: 'textfield', flex:1},
                    {header: 'C', width: 250, dataIndex: 'c', field: 'textfield', flex:1},
                    {header: 'D', width: 250, dataIndex: 'd', field: 'textfield', flex:1}
                ],
                store: new Ext.data.Store({
                    fields: [
                        {name: 'a'},
                        {name: 'b'},
                        {name: 'c'},
                        {name: 'd'}
                    ],
                    pageSize: 15,
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

                            // Complete grid with empty rows
                            for(var i = this.getCount(); i < this.pageSize; i++)
                                grid.store.add({"a":"", "b":"", 'c':'', 'd':''});
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
                emptyText: tr("Please select cells in the grid above..."),
                listeners: {
                    focus: function() {
                        // Update last focused item
                        this.ownerCt.lastFocus = this;
                    },
                },
                regex: /^(\$[A-Za-z]\$([1-9]+)\;)*$/,
                regexText:tr("Please select cells in the grid above..."),
            },
            {
                fieldLabel: tr('Chart series', 'common'),
                name: 'chartdatasets',
                id:'chartdatasets',
                xtype: 'textfield',
                labelAlign: 'top',
                width:'100%',
                emptyText: tr("Please select cells in the grid above..."),
                listeners: {
                    focus: function() {
                        // Update last focused item
                        this.ownerCt.lastFocus = this;
                    },
                },
                regex: /^([A-Za-z]\;)*$/,
                regexText:tr("Please select cells in the grid above..."),
            }
        ]

        // As there is no blur event for grid, check when
        // mousedown event is outside the grid.
        Ext.getDoc().on("mousedown", function(e) {
            var chartgrid  = Ext.getCmp('chartgrid');
            var chart      = Ext.getCmp('chart_container');
            if(chart && chart.lastFocus && !e.within(chartgrid.getEl()))
            {
                chart.lastFocus = null;
                chartgrid.getSelectionModel().allCellDeselect();
            }
        });

        this.callParent(this);
    }
});