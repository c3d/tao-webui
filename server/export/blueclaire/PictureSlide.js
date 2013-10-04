var u = require(__dirname + '/../../util');

function header(ctx)
{
    if (ctx.hasOwnProperty('blueclaire'))
        return '';
    ctx['blueclaire'] = 1;
    return 'import BlueClaireTheme\n';
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "BlueClaire"\n'
    ddd += 'picture_slide "' + u.escape(page.name) + '",\n';
    if (page.picture != '')
    {
        ddd += '    locally\n';
        ddd += '        color "white"\n';
        ddd += '        image ' + page.picturex + ', ' + page.picturey + ', ' + page.picturescalepercent + '%, ' + page.picturescalepercent + '%, "' + page.picture + '"\n';
        empty = false;
    }
    if (page.leftcolumn && page.leftcolumn !== '')
    {
        ddd += '    left_column\n';
        ddd += u.htmlToSlideContent(page.leftcolumn, 2);
        empty = false;
    }
    if (page.leftcolumn && page.rightcolumn !== '')
    {
        ddd += '    right_column\n';
        ddd += u.htmlToSlideContent(page.rightcolumn, 2);
        empty = false;
    }
    if (empty)
        ddd += '    nil\n';
    return ddd;
}

module.exports = {
    header:   header,
    generate: generate
}
