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
    if (page.title != '')
    {
        ddd += indent + 'title\n' + htmlToSlide(page.title, indent);
    }
    else
    {
        ddd += indent + 'title text page_label\n';
    }
    if (page.subtitle != '')
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


function emitLeftColumn(page, indent)
{
    var ddd = '';
    if (page.leftcolumn && page.leftcolumn !== '')
    {
        ddd += indent + 'left_column\n' + htmlToSlide(page.leftcolumn, indent);
    }
    return ddd;
}


function emitRightColumn(page, indent)
{
    var ddd = '';
    if (page.rightcolumn && page.rightcolumn !== '')
    {
        ddd += indent + 'right_column\n' + htmlToSlide(page.rightcolumn,indent);
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
    if (picture)
    {
        ddd = indent + kind
            + indent + '    image ' + picture.x + ', ' + picture.y + ', '
            + picture.scale_x + '%, ' + picture.scale_y + '%, "'
            + util.escape(picture.name) + '"\n';
    }
    return ddd;
}


function emitPictures(page, indent)
{
    var ddd = '';
    if (page.picture)
        ddd += emitPicture('picture', page.picture, indent);
    if (page.left_picture)
        ddd += emitPicture('left_picture', page.left_picture, indent);
    if (page.right_picture)
        ddd += emitPicture('right_picture', page.left_picture, indent);
    return ddd;
}


function emitLeft(page, indent)
{
    var ddd = emitLeftColumn(page, indent);
    if (page.left_picture)
        ddd += emitPicture('left_picture', page.left_picture, indent);
    return ddd;
}


function emitRight(page, indent)
{
    var ddd = emitRightColumn(page, indent);
    if (page.right_picture)
        ddd += emitPicture('right_picture', page.right_picture, indent);
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
        else
        {
            ddd += '    title text page_label\n';
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

function generatePictureSlide(Theme)
{
    return function (page)
    {
        var empty = true;
        var ddd = '';
        ddd += util.theme(page.ctx, Theme)
        ddd += 'picture_slide "' + util.escape(page.name) + '",\n';
        if (page.picture != '')
        {
            ddd += '    locally\n';
            ddd += '        color "white"\n';
            ddd += '        image ' + page.picturex + ', ' + page.picturey + ', ' + page.picturescalepercent + '%, ' + page.picturescalepercent + '%, "' + page.picture + '"\n';
            empty = false;
        }
        if (page.leftcolumn && page.leftcolumn !== '')
        {
            ddd += '    left_column\n' +
                   '        vertical_align_top\n' +
                   '        align_left\n';
            ddd += util.htmlToSlideContent(page.leftcolumn, 2);
            empty = false;
        }
        if (page.rightcolumn && page.rightcolumn !== '')
        {
            ddd += '    right_column\n' +
                   '        vertical_align_top\n' +
                   '        align_left\n';
            ddd += util.htmlToSlideContent(page.rightcolumn, 2);
            empty = false;
        }
        if (empty)
            ddd += '    nil\n';
        return ddd;
    }
}

function generateMovieSlide(Theme)
{
    return function (page)
    {
        var empty = true;
        var movie = page.movie;
        var hasMovie = false;
        var ddd = '';
        ddd += util.theme(page.ctx, Theme)
        ddd += 'picture_slide "' + util.escape(page.name) + '",\n';
        if (page.movie != '')
        {
            if (page.movie.indexOf('://') === -1)
                movie = 'videos/' + movie;
            ddd += '    locally\n';
            ddd += '        color "white"\n';
            ddd += '        movie ' + page.moviex + ', ' + page.moviey + ', ' + page.moviescalepercent + '%, ' + page.moviescalepercent + '%, "' + movie + '"\n';
            empty = false;
            hasMovie = true;
        }
        if (page.leftcolumn && page.leftcolumn !== '')
        {
            ddd += '    left_column\n' +
                   '        vertical_align_top\n' +
                   '        align_left\n';
            ddd += util.htmlToSlideContent(page.leftcolumn, 2);
            empty = false;
        }
        if (page.rightcolumn && page.rightcolumn !== '')
        {
            ddd += '    right_column\n' +
                   '        vertical_align_top\n' +
                   '        align_left\n';
            ddd += util.htmlToSlideContent(page.rightcolumn, 2);
            empty = false;
        }
        if (empty)
            ddd += '    nil\n';
        if (hasMovie)
            ddd += '    on "pageexit",\n' +
                   '        movie_drop "' + movie + '"\n';
        return ddd;
    }
}

function generateSlide(Theme)
{
    return function(page)
    {
        var empty = true;
        var ddd = '';
        ddd += util.theme(page.ctx, Theme)
        ddd += 'slide "' + util.escape(page.name) + '",\n';
        if (page.text != '')
        {
            ddd += util.htmlToSlideContent(page.text);
            empty = false;
        }
        if (empty)
            ddd += '    nil\n';
        return ddd;
    }
}

function generateBaseSlide(Theme)
{
    return function (page)
    {
        var empty = true;
        var ddd = '';
        ddd += util.theme(page.ctx, Theme)
        ddd += 'base_slide "' + util.escape(page.name) + '",\n';
        if (page.title && page.title !== '')
        {
            ddd += '    title\n';
            ddd += util.htmlToSlideContent(page.title, 2);
            empty = false;
        }
        if (page.subtitle && page.subtitle !== '')
        {
            ddd += '    subtitle\n';
            ddd += util.htmlToSlideContent(page.subtitle, 2);
            empty = false;
        }
        if (page.story && page.story !== '')
        {
            ddd += '    story\n' +
                   '        vertical_align_top\n' +
                   '        align_left\n';
            ddd += util.htmlToSlideContent(page.story, 2);
            empty = false;
        }
        if (page.left_column && page.left_column !== '')
        {
            ddd += '    left_column\n' +
                   '        vertical_align_top\n' +
                   '        align_left\n';
            ddd += util.htmlToSlideContent(page.left_column, 2);
            empty = false;
        }
        if (page.right_column && page.right_column !== '')
        {
            ddd += '    right_column\n' +
                   '        vertical_align_top\n' +
                   '        align_left\n';
            ddd += util.htmlToSlideContent(page.right_column, 2);
            empty = false;
        }
        if (page.picture != '')
        {
            ddd += '    picture\n';
            ddd += '        color "white"\n';
            ddd += '        image ' + page.picx + ', ' + page.picy + ', ' + page.picscale + '%, ' + page.picscale + '%, "' + page.picture + '"\n';
            empty = false;
        }
        if (page.left_picture != '')
        {
            ddd += '    left_picture\n';
            ddd += '        color "white"\n';
            ddd += '        image ' + page.lpicx + ', ' + page.lpicy + ', ' + page.lpicscale + '%, ' + page.lpicscale + '%, "' + page.left_picture + '"\n';
            empty = false;
        }
        if (page.right_picture != '')
        {
            ddd += '    right_picture\n';
            ddd += '        color "white"\n';
            ddd += '        image ' + page.rpicx + ', ' + page.rpicy + ', ' + page.rpicscale + '%, ' + page.rpicscale + '%, "' + page.right_picture + '"\n';
            empty = false;
        }

        if(page.chartdata && page.chartdata != '')
        {
            var dataIndexes = ['a', 'b', 'c', 'd'];

            // Use page name as id for our chart (as we have only one chart per page for the moment)
            var chartid = util.escape(page.name);
            ddd += '    picture\n';
            ddd += '        chart_current "' + chartid + '"\n';
            ddd += '        once\n';
            ddd += '            chart_reset\n';

            if(page.charttitle != '')
                ddd += '            chart_set_title "' + util.escape(page.charttitle) + '"\n';

            ddd += '            chart_set_style "' + page.chartstyle.toLowerCase() + '"\n';

            // Parse our chart data
            var data = JSON.parse(page.chartdata);
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

            if(page.chartxlabel != '')
                ddd += '            chart_set_xlabel "' + util.escape(page.chartxlabel) + '"\n';
            if(page.chartylabel != '')
                ddd += '            chart_set_ylabel "' + util.escape(page.chartylabel) + '"\n';

            if(page.chartlegend != '')
            {
                // Parse chart legend indexes
                var indexes = page.chartlegend.split('$');
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

            if(page.charttype)
                ddd += '            chart_set_type "' + page.charttype.toLowerCase() + '"\n';

            // If user has given datasets, then draw it
            // Otherwise draw all datasets
            if(page.chartdatasets != '')
            {
                // Parse datasets given by user and save it as a XL array ({1,2,etc.})
                var datasets = '';
                var datasetsIndexes = page.chartdatasets.split(';');
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
    generateSlide: generateSlide,
    generatePictureSlide: generatePictureSlide,
    generateMovieSlide: generateMovieSlide,
    generateBaseSlide: generateBaseSlide,

    emitTitle: emitTitle,
    emitStory: emitStory,
    emitLeftColumn: emitLeftColumn,
    emitRightColumn: emitRightColumn,
    emitColumns: emitColumns,
    emitPictures: emitPictures,
    emitLeft:  emitLeft,
    emitRight: emitRight,
    emitPage: emitPage
}
