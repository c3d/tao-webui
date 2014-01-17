// ============================================================================
//
//    Standard slide structure
//
// ============================================================================

var util = require('./util');

// Generate an import that runs only once
function importHeader(Name)
{
    return function(ctx)
    {
        if (ctx.hasOwnProperty(Name))
            return ''
        ctx[Name] = 1
        return 'import ' + Name + '\n'
    }
}

function importHeaders(Names)
{
    return function(ctx) {
        var imports = ''
        Names.forEach(function(Name) {
            if (!ctx.hasOwnProperty(Name))
            {
                ctx[Name] = 1;
                imports += 'import ' + Name + '\n';
            }
        });
        return imports;
    }
}


function indent(code, before)
{
    var array = code.split('\n');
    var result = '';
    array.forEach(function(line) {
        result += before + line + '\n';
    });
    return result;
}


function htmlToSlide(text, indentText)
{
    var result = util.htmlToSlideContent(text, 1);
    result = indent(result, indentText);
    return result;
}


function emitTitle(page, indent)
{
    var ddd = '';
    if (page.title && page.title != '')
    {
        ddd += indent + 'title\n' + htmlToSlide(page.title, indent);
    }
    else
    {
        ddd += indent + 'title text page_label\n';
    }
    if (page.subtitle && page.subtitle != '')
    {
        ddd += indent + 'subtitle\n' + htmlToSlide(page.subtitle, indent);
    }
    return ddd;
}


function emitStory(page, indent)
{
    var ddd = '';
    if (page.story)
    {
        ddd += indent + 'story\n' + htmlToSlide(page.story, indent);
    }
    return ddd;
}


function emitDynamicFields(page, indent)
{
    var ddd = '';
    var dynamic = page.dynamicfields;
    if(dynamic && dynamic != '')
    {
        // Decode JSON string
        var items = JSON.parse(dynamic);

        ddd += emitTitle(items, indent);
        ddd += emitStory(items, indent);
        ddd += emitLeftColumn(items, indent);
        ddd += emitRightColumn(items, indent);
        ddd += emitChart(items, indent, page.name);
        ddd += emitPictures(items, indent);
        ddd += emitMovies(items, indent);
    }
    return ddd;
}


function emitTextBoxes(page, indent)
{
    var ddd = '';
    var texts = util.filterJSON(items, 'text_');
    for(var i = 0; i < texts.length; i++)
    {
        ddd += indent + 'text_box 0, 0, 600, 600,\n';
        ddd += util.htmlToSlideContent(texts[i],  2);
    }
    return ddd;
}

function emitLeftColumn(page, indent)
{
    var ddd = '';
    if (page.left_column && page.left_column !== '')
    {
        ddd += indent + 'left_column\n' + htmlToSlide(page.left_column, indent);
    }
    return ddd;
}


function emitRightColumn(page, indent)
{
    var ddd = '';
    if (page.right_column && page.right_column !== '')
    {
        ddd += indent + 'right_column\n' + htmlToSlide(page.right_column,indent);
    }
    return ddd;
}


function emitColumns(page, indent)
{
    return emitLeftColumn(page, indent) + emitRightColumn(page, indent);
}


function emitPicture(kind, picture, indent)
{
    var ddd = '';
    // Get correct picture url (ignore id)
    var pic = util.filterJSON(picture, 'picture')[0];
    if (pic)
    {
        // Parse and get picture settings by ignoring id behind
        // property name (for instance, {picx_1:30} returns 30).
        var picx = util.filterJSON(picture, 'picx')[0];
        var picy = util.filterJSON(picture, 'picy')[0];
        var picscale = util.filterJSON(picture, 'picscale')[0];
        ddd = indent + kind + '\n'
            + indent + '    image ' + picx + ', ' + picy + ', '
            + picscale + '%, ' + picscale + '%, "'
            + util.escape(pic) + '"\n';
    }
    return ddd;
}


function emitPictures(page, indent)
{
    var ddd = '';

    // Get all pictures
    var pictures = util.filterJSON(page, '^picture');
    for(var i = 0; i < pictures.length; i++)
    {
        var picture = pictures[i];
        if(picture)
            ddd += emitPicture('picture', picture, indent);
    }

    return ddd;
}


function emitMovie(kind, movie, indent)
{
    var ddd = '';

        // Get correct picture url (ignore id)
    var movieurl = util.filterJSON(movie, 'movie')[0];
    if(movieurl)
    {
        // Parse and get picture settings by ignoring id behind
        // property name (for instance, {moviex:30} returns 30).
        var moviex = util.filterJSON(movie, 'moviex')[0];
        var moviey = util.filterJSON(movie, 'moviey')[0];
        var moviescalepercent = util.filterJSON(movie, 'moviescalepercent')[0];

        if (movieurl.indexOf('://') === -1)
            movieurl = 'videos/' + movieurl;
        ddd = indent + kind + '\n'
        ddd += indent + '    color "white"\n';
        ddd += indent + '    movie ' + moviex + ', ' + moviey + ', ' + moviescalepercent + '%, ' + moviescalepercent + '%, "' + movieurl + '"\n';

        // Add drop command
        ddd +=  indent + '    on "pageexit",\n';
        ddd +=  indent + '        movie_drop "' + movieurl + '"\n';
    }

    return ddd;
}


function emitMoviesWithType(page, indent, filter)
{
    var ddd = '';
    var movies = util.filterJSON(page, filter);
    for(var i = 0; i < movies.length; i++)
    {
        var movie = movies[i];
        if(movie)
            ddd += emitMovie('picture', movie, indent);
    }
    return ddd;
}


function emitMovies(page, indent)
{
    var ddd = '';

    // Get all movies
    var movies = util.filterJSON(page, '^movie');
    for(var i = 0; i < movies.length; i++)
    {
        var movie = movies[i];
        if(movie)
            ddd += emitMovie('picture', movie, indent);
    }

    return ddd;
}


function emitChart(page, index, name)
{
    var ddd = '';
    if(page.chart && page.chart != '')
    {
        var chart = page.chart;

        if(chart.chartdata && chart.chartdata != '')
        {
            var dataIndexes = ['a', 'b', 'c', 'd'];

            // Use page name as id for our chart (as we have only one chart per page for the moment)
            var chartid = util.escape(name);

            ddd += '    picture\n';
            ddd += '        chart_current "' + chartid + '"\n';
            ddd += '        once\n';
            ddd += '            chart_reset\n';

            if(chart.charttitle && chart.charttitle != '')
                ddd += '            chart_set_title "' + util.escape(chart.charttitle) + '"\n';

            if(chart.chartstyle && chart.chartstyle != '')
                ddd += '            chart_set_style "' + chart.chartstyle.toLowerCase() + '"\n';

            if(chart.chartformat && chart.chartformat != '')
                ddd += '            chart_set_format "' + chart.chartformat + '"\n';

            // // Parse our chart data
            var data = JSON.parse(chart.chartdata);
            for(var i = 0; i < data.length; i++)
            {
                for(var j = 0; j < dataIndexes.length; j++)
                {
                    var index = dataIndexes[j];
                    var value = data[i][index];
                    if(value == parseFloat(value)) // Check that value is really a number
                        ddd += '            chart_push_data ' + (j + 1) + ', ' + data[i][index] + '\n';
                }
            }

            if(chart.chartxlabel && chart.chartxlabel != '')
                ddd += '            chart_set_xlabel "' + util.escape(chart.chartxlabel) + '"\n';
            if(chart.chartylabel && chart.chartylabel != '')
                ddd += '            chart_set_ylabel "' + util.escape(chart.chartylabel) + '"\n';

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
                        if(data.hasOwnProperty(row - 1) && data[row-1].hasOwnProperty(col))
                        {
                            var item = data[row - 1][col];
                            if(item)
                                ddd += '            chart_set_legend ' + (i + 1)/2 + ', "' + util.escape(item) + '"\n';
                        }
                    }
                }
            }

            if(chart.charttype && chart.charttype)
                ddd += '            chart_set_type "' + chart.charttype.toLowerCase() + '"\n';

            // If user has given datasets, then draw it
            // Otherwise draw all datasets
            if(chart.chartdatasets && chart.chartdatasets != '')
            {
                // Parse datasets given by user and save it as a XL array ({1,2,etc.})
                var datasets = '';
                var datasetsIndexes = chart.chartdatasets.split(';');
                for(var i = 0; i < datasetsIndexes.length; i++)
                {
                    var datasetNumber = dataIndexes.indexOf(datasetsIndexes[i].toLowerCase()) + 1;
                    if(datasetNumber > 0)
                    {
                        if(datasets == '')
                            datasets += datasetNumber;
                        else
                            datasets += ',' + datasetNumber;
                    }
                }

                // Use primitive which draw only given datasets
                ddd += '        chart ' + datasets + '\n';
            }
            else
            {
                // Use primitive which draw all datasets
                ddd += '        chart \n';
            }
        }
    }
    return ddd;
}



function emitPage(page, indent)
{
    var ddd = '';
    ddd += emitTitle(page, indent);
    ddd += emitStory(page, indent);
    ddd += emitLeftColumn(page, indent);
    ddd += emitRightColumn(page, indent);
    ddd += emitPictures(page, indent);
    return ddd;
}


// Emit a main title slide or section slide
function generateTitleSlide(Kind, Theme)
{
    return function (page)
    {
        var ddd = '';
        ddd += util.theme(page.ctx, Theme)
        ddd += Kind + ' "' + util.escape(page.name) + '",\n';
        if (page.title != '')
        {
            ddd += '    title\n';
            ddd += '        text "' + util.escape(page.title) + '"\n';
        }
        if (page.subtitle != '')
        {
            ddd += '    subtitle\n';
            ddd += util.htmlToSlideContent(page.subtitle, 2);
        }

        return ddd;
    }
}

function generateMainTitleSlide(Theme)
{
    return generateTitleSlide('main_title_slide', Theme)
}

function generateSectionSlide(Theme)
{
    return generateTitleSlide('section_slide', Theme)
}

function generateBaseSlide(Theme)
{
    return function (page)
    {
        var empty = true;
        var ddd = '';
        var indent = '    ';
        ddd += util.theme(page.ctx, Theme)
        ddd += 'base_slide "' + util.escape(page.name) + '",\n';

        // Emit dynamic fields (texts, pictures, etc)
        if(page.dynamicfields != '')
        {
            ddd += emitDynamicFields(page, '    ');
            empty = false;
        }

        if (empty)
            ddd += '    nil\n';
        return ddd;
    }
}

module.exports = {
    importHeader: importHeader,
    importHeaders: importHeaders,
    generateMainTitleSlide: generateMainTitleSlide,
    generateSectionSlide: generateSectionSlide,
    generateBaseSlide: generateBaseSlide,

    emitTitle: emitTitle,
    emitStory: emitStory,
    emitLeftColumn: emitLeftColumn,
    emitRightColumn: emitRightColumn,
    emitColumns: emitColumns,
    emitPictures: emitPictures,
    emitPage: emitPage
}
