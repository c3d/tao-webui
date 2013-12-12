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

// Emit a main title slide or section slide
function generateTitleSlide(Kind, Theme)
{
    return function (page)
    {
        var empty = true;
        var ddd = '';
        ddd += util.theme(page.ctx, Theme)
        ddd += Kind + ' "' + util.escape(page.name) + '",\n';
        if (page.title != '')
        {
            ddd += '    title\n';
            ddd += '        text "' + util.escape(page.title) + '"\n';
            empty = false;
        }
        if (page.subtitle != '')
        {
            ddd += '    subtitle\n';
            ddd += util.htmlToSlideContent(page.subtitle, 2);
            empty = false;
        }
        if (empty)
            ddd += '    title text page_label\n';
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
        var hasMovie = false;
        var ddd = '';
        ddd += util.theme(page.ctx, Theme)
        ddd += 'picture_slide "' + util.escape(page.name) + '",\n';
        if (page.movie != '')
        {
            ddd += '    locally\n';
            ddd += '        color "white"\n';
            ddd += '        movie ' + page.moviex + ', ' + page.moviey + ', ' + page.moviescalepercent + '%, ' + page.moviescalepercent + '%, "' + page.movie + '"\n';
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
                   '        movie_drop "' + page.movie + '"\n';
        
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

        if(page.chartdata != '')
        {
            // Use page name as id for our chart (as we have only one chart per page for the moment)
            var chartid = util.escape(page.name);
            ddd += '    picture\n';
            ddd += '        once\n';
            ddd += '            chart_current "' + chartid + '"\n';
            ddd += '            chart_reset\n';

            if(page.chartname != '')
                ddd += '            chart_set_title "' + util.escape(page.chartname) + '"\n';

            ddd += '            chart_set_style "' + page.chartstyle.toLowerCase() + '"\n';

            // Parse our chart data
            var data = JSON.parse(page.chartdata);
            for(var i = 0; i < data.length; i++)
            {
                var indexes = ['a', 'b', 'c', 'd'];
                for(var j = 0; j < indexes.length; j++)
                {
                    var index = indexes[j];
                    var value = data[i][index];
                    if(value == parseFloat(value)) // Check that value is really a number
                        ddd += '            chart_push_data ' + (j + 1) + ', ' + data[i][index] + '\n';
                }
            }

            if(page.chartxlabel != '')
                ddd += '            chart_set_xlabel "' + page.chartxlabel + '"\n';
            if(page.chartylabel != '')
                ddd += '            chart_set_ylabel "' + page.chartylabel + '"\n';

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

                        // Check that properties exists
                        if(data.hasOwnProperty(row - 1) && data[row-1].hasOwnProperty(col))
                        {
                            var item = data[row - 1][col];
                            if(item)
                                ddd += '            chart_set_legend ' + (i + 1)/2 + ', "' + item + '"\n';
                        }
                    }
                }            
            }

            ddd += '        chart "' + chartid + '", "' + page.charttype.toLowerCase() + '"\n';
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
    generateBaseSlide: generateBaseSlide
}
