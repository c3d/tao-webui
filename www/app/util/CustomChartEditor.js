Ext.define('TE.util.CustomChartEditor', {
    extend:'Ext.form.FieldSet',
    alias: 'widget.customcharteditor',
    requires:['TE.util.CustomGridEditor'],
    itemId:"chart_container",
    index:'',
    name:"chart",
    title:tr('Chart', 'common'),
    collapsible: true,
    collapsed:false,


    getValue: function()
    // ------------------------------------------------------------------------
    //   Return all values of chart in a json object
    // ------------------------------------------------------------------------
    {
        var result = '{';
        var items = this.items.items;
        Ext.each(items, function(item, index) {
            var value = item.value;
            if(value && value != '')
            {
                // Add coma if needed
                if(result != '{')
                    result += ',';
                if (item.name != 'data')
                    value = Ext.encode(value);
                result += '\"' + item.name + '\":' +value + '';
            }
        });
        result+='}';
        return result;
    },


    setValue: function(json)
    // ------------------------------------------------------------------------
    //   Set all values of chart according to a json object
    // ------------------------------------------------------------------------
    {
        if(!json || json == '')
            return;

        var fields = this.items.items;
        for(var idx in fields)
        {
            var field = fields[idx];
            if(json.hasOwnProperty(field.name))
            {
                var value = json[field.name];
                if(value && value != '')
                {
                    if (field.name == 'data')
                        value = JSON.stringify(value);
                    field.setValue(value);
                }
            }
        }
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    //  Override toJSON method
    // ------------------------------------------------------------------------
    {
        return this.getValue();
    },


    getChartTypes: function()
    // ------------------------------------------------------------------------
    //   Return the possible chart types
    // ------------------------------------------------------------------------
    {
        return [{abbr:"Area",   name:tr('Area', 'common'),},
                {abbr:"Bar",    name:tr('Bar', 'common')},
                {abbr:"Line",   name:tr('Line', 'common')},
                {abbr:"Pie",    name:tr('Pie', 'common')}]
    },


    getChartStyles: function(type)
    // ------------------------------------------------------------------------
    //   Return chart styles for the given chart type
    // ------------------------------------------------------------------------
    {
        var data=[];
        switch(type){
        case 'Area':
            data=[{abbr:"Default",              name:tr('Default')},
                  {abbr:"Stacked",              name:tr('Stacked')}];
            break;
            
        case 'Bar':
            data=[{abbr:"Horizontal",           name:tr('Horizontal')},
                  {abbr:"Horizontal_stacked",   name:tr('Horizontal stacked')},
                  {abbr:"Vertical",             name:tr('Vertical')},
                  {abbr:"Vertical_stacked",     name:tr('Vertical stacked')}];
            break;
            
        case 'Line':
            data=[{abbr:"Line",                 name:tr('Line')},
                  {abbr:"Line&Point",           name:tr('Line & Point')},
                  {abbr:"Point",                name:tr('Point')}];
            break;
            
        case 'Pie':
            data=[{abbr:"Default",              name:tr('Default')}];
            break;
        }
        
        return data;
    },


    getChartFormats: function()
    // ------------------------------------------------------------------------
    //   Return chart formats
    // ------------------------------------------------------------------------
    {
        return [{abbr:'2D',  name:tr('2D', 'common')},
                {abbr:'3D',  name:tr('3D', 'common')}];
    },


    updateChartStyles: function()
    // ------------------------------------------------------------------------
    //   Update field with chart styles
    // ------------------------------------------------------------------------
    {
        var types  = this.down('#charttype');
        var styles = this.down('#chartstyle');
        var input  = types.getValue();
        var data   = this.getChartStyles(input);
        styles.store.loadData(this.getChartStyles(input));
        styles.setValue(data[0].abbr);
    },


    initComponent: function ()
    // ------------------------------------------------------------------------
    //   Initialize chart component
    // ------------------------------------------------------------------------
    {
        var chartEditor = this;

        this.border = false;
        this.lastFocus = null;

        this.items = [
            {
                fieldLabel: tr('Chart title', 'common'),
                name: 'title',
                itemId:'charttitle',
                xtype: 'textfield',
                labelAlign: 'top',
                value:'chart',
                anchor:'100%'
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
                name: 'type',
                itemId:'charttype',
                anchor:'100%',
                value:'Bar',
                fieldLabel: tr('Chart type', 'common'),
                labelAlign: 'top',
                listeners: {
                    select: function(combo, record, index) {
                        chartEditor.updateChartStyles();
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
                name: 'style',
                itemId:'chartstyle',
                anchor:'100%',
                value:'Vertical',
                fieldLabel: tr('Chart style', 'common'),
                labelAlign: 'top',
            },
            {
                xtype: 'combobox',
                store: Ext.create('Ext.data.Store', {
                    fields: ['abbr', 'name'],
                    data: this.getChartFormats(),
                }),
                queryMode: 'local',
                displayField: 'name',
                valueField: 'abbr',
                editable: false,
                autoSelect: true,
                name: 'format',
                itemId:'chartformat',
                anchor:'100%',
                value:'2D',
                fieldLabel: tr('Chart format', 'common'),
                labelAlign: 'top',
            },
            {
                fieldLabel: tr('Chart x-label', 'common'),
                name: 'xlabel',
                itemId: 'chartxlabel',
                xtype: 'textfield',
                labelAlign: 'top',
                anchor:'100%',
                emptyText: "x-axis",
            },
            {
                fieldLabel: tr('Chart y-label', 'common'),
                name: 'ylabel',
                itemId:'chartylabel',
                xtype: 'textfield',
                labelAlign: 'top',
                anchor:'100%',
                emptyText: "y-axis",
            },
            {
                xtype: 'hiddenfield',
                name: 'data',
                itemId:'chartdata'
            },
            {
                xtype: 'label',
                text: tr('Chart data:', 'common'),
            },
            {
                xtype: 'customgrideditor',
                name:'grid',
                itemId:'chartgrid',
                anchor:'100%',
                resizable: true,
                width: 500,
                maxHeight: 450,
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
                    autoLoad: true,
                    listeners: {
                        load: function() {
                            var chartData = chartEditor.down('#chartdata');
                            var chartGrid = chartEditor.down('#chartgrid');

                            var jsonData = chartData.getValue();
                            if(jsonData != '')
                            {
                                var data = Ext.decode(jsonData);
                                chartGrid.getStore().loadData(data);
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
                    var chartdata  = chartEditor.down('#chartdata');
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
                                this.down('#chartlegend').setValue(legend);
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

                                // Save it to an Excel form (A;B;etc.)
                                for(var i = 0; i < datasetsIndexes.length; i++)
                                    datasets += datasetsIndexes[i] + ';';

                                // Update field
                                this.down('#chartdatasets').setValue(datasets);
                            }
                        }
                    }
                }
            },
            {
                fieldLabel: tr('Chart legend', 'common'),
                name: 'legend',
                itemId:'chartlegend',
                xtype: 'textfield',
                labelAlign: 'top',
                anchor:'100%',
                emptyText: tr("Please select cells in the grid above..."),
                listeners: {
                    focus: function() {
                        // Update last focused item
                        this.ownerCt.lastFocus = this;
                    },
                    change: function(){
                        // Need to fire change event to parent
                        // As we have redefine listeners
                        this.ownerCt.fireEvent('change', this.ownerCt);
                    },
                },
                regex: /^(\$[A-Za-z]\$([1-9]+)\;)*$/,
                regexText:tr("Please select cells in the grid above..."),
            },
            {
                fieldLabel: tr('Chart series', 'common'),
                name: 'datasets',
                itemId:'chartdatasets',
                xtype: 'textfield',
                labelAlign: 'top',
                anchor:'100%',
                emptyText: tr("Please select cells in the grid above..."),
                listeners: {
                    focus: function() {
                        // Update last focused item
                        this.ownerCt.lastFocus = this;
                    },
                    change: function(){
                        // Need to fire change event to parent
                        // As we have redefine listeners
                        this.ownerCt.fireEvent('change', this.ownerCt);
                    },
                },
                regex: /^([A-Za-z]\;)*$/,
                regexText:tr("Please select cells in the grid above..."),
            }
        ]

        // As blur event didn't work for grid, we check when
        // mousedown event is outside the grid to
        // simulate it and unfocus all cells.
        Ext.getDoc().on("mousedown", function(e) {
            var chartgrid  = chartEditor.down('#chartgrid');
            var chart      = chartEditor;
            if(chart && chart.lastFocus && !e.within(chartgrid.getEl()))
            {
                chart.lastFocus = null;
                chartgrid.getSelectionModel().allCellDeselect();
            }
        });

        this.callParent(arguments);
    },

});
