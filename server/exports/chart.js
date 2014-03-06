// ****************************************************************************
//  chart.js                                                       Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Export charts information
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
//  (C) 2014 Baptiste Soulisse <cathy@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

var util = require('../util');

function emitChart(page, indent, id)
// ----------------------------------------------------------------------------
//   Emit the code for the chart
// ----------------------------------------------------------------------------
{
    var ddd = '';
    var name = id ? id : page.name;
    var chart = id ? page.properties[id] : page.properties.chart;

    function emit (txt)
    {
        ddd += indent + txt + '\n';
    }

    if (chart && chart != '')
    {
        var chartdata = chart.chartdata;
        if (chartdata && chartdata != '')
        {
            var dataIndexes = ['a', 'b', 'c', 'd'];

            // Use page name as id for our chart
            // (as we have only one chart per page for the moment)
            var chartid = util.escape(name);

            emit('picture');
            emit('    chart_current "' + chartid + '"');
            emit('    once');
            emit('        chart_reset');

            if(chart.charttitle && chart.charttitle != '')
                emit('        chart_set_title "'
                     + util.escape(chart.charttitle)+'"');

            if(chart.chartstyle && chart.chartstyle != '')
                emit('        chart_set_style "'
                     + chart.chartstyle.toLowerCase() + '"');

            if(chart.chartformat && chart.chartformat != '')
                emit('        chart_set_format "' + chart.chartformat + '"');

            // // Parse our chart data
            var data = JSON.parse(chart.chartdata);
            for(var i = 0; i < data.length; i++)
            {
                for(var j = 0; j < dataIndexes.length; j++)
                {
                    var index = dataIndexes[j];
                    var value = data[i][index];

                    // Check that value is really a number
                    if(value == parseFloat(value))
                        emit('        chart_push_data ' + (j + 1)
                             + ', ' + data[i][index]);
                }
            }
        }

        if(chart.chartxlabel && chart.chartxlabel != '')
            emit ('        chart_set_xlabel "'
                  + util.escape(chart.chartxlabel) + '"');
        if(chart.chartylabel && chart.chartylabel != '')
            emit ('        chart_set_ylabel "'
                  + util.escape(chart.chartylabel) + '"');
        
        if(chart.chartlegend && chart.chartlegend != '')
        {
            // Parse chart legend indexes
            var indexes = chart.chartlegend.split('$');
            for(var i = 1; i < indexes.length; i+=2)
            {
                var col = indexes[i];
                var row = indexes[i+1];
                if(col && row)
                {
                    // Remove semi-colons
                    col = col.replace(';', '').toLowerCase();
                    row = row.replace(';', '');
                    
                    // Check that properties exist
                    if(data.hasOwnProperty(row - 1) &&
                       data[row-1].hasOwnProperty(col))
                    {
                        var item = data[row - 1][col];
                        if(item)
                            emit('        chart_set_legend '
                                 + (i + 1)/2 + ', "'
                                 + util.escape(item) + '"');
                    }
                }
            }
        }
        
        if(chart.charttype && chart.charttype)
            emit('        chart_set_type "'
                 + chart.charttype.toLowerCase() + '"');
        
        // If user has given datasets, then draw it
        // Otherwise draw all datasets
        if(chart.chartdatasets && chart.chartdatasets != '')
        {
            // Parse datasets given by user and save it as
            // an XL array ({1,2,etc.})
            var datasets = '';
            var datasetsIndexes = chart.chartdatasets.split(';');
            for(var i = 0; i < datasetsIndexes.length; i++)
            {
                var idx = datasetsIndexes[i].toLowerCase();
                var datasetNumber = dataIndexes.indexOf(idx) + 1;
                if(datasetNumber > 0)
                {
                    if(datasets == '')
                        datasets += datasetNumber;
                    else
                        datasets += ',' + datasetNumber;
                }
            }
            
            // Use primitive which draw only given datasets
            emit('    chart ' + datasets);
        }
        else
        {
            // Use primitive which draw all datasets
            emit('    chart');
        }
    }
    return ddd;
}


module.exports = emitChart;
