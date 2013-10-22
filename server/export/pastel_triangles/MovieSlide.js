var u = require(__dirname + '/../../util');

function header(ctx)
{
    var hdr = '';
    if (!ctx.hasOwnProperty('pastel_triangles'))
    {
        hdr += 'import PastelTrianglesTheme\n'
        ctx['pastel_triangles'] = 1;
    }
    if (!ctx.hasOwnProperty('VLCAudioVideo'))
    {
        hdr += 'import VLCAudioVideo\n'
        ctx['VLCAudioVideo'] = 1;
    }
    return hdr;
}

function generate(page)
{
    var empty = true;
    var hasMovie = false;
    var ddd = '';
    ddd += 'theme "PastelTriangles"\n'
    ddd += 'picture_slide "' + u.escape(page.name) + '",\n';
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
        ddd += '    left_column\n';
        ddd += u.htmlToSlideContent(page.leftcolumn, 2);
        empty = false;
    }
    if (page.rightcolumn && page.rightcolumn !== '')
    {
        ddd += '    right_column\n';
        ddd += u.htmlToSlideContent(page.rightcolumn, 2);
        empty = false;
    }
    if (empty)
        ddd += '    nil\n';
    if (hasMovie)
        ddd += 'on "pagechange",\n' +
               '    if prev_page_label = "' + u.escape(page.name) + '" then\n' +
               '        movie_drop "' + page.movie + '"\n';

    return ddd;
}

module.exports = {
    header:   header,
    generate: generate
}
