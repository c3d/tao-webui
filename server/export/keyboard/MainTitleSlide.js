var u = require(__dirname + '/../../util');

function header(ctx)
{
    if (ctx.hasOwnProperty('keyboard'))
        return '';
    ctx['keyboard'] = 1;
    return 'import KeyboardTheme\n';
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "Keyboard"\n'
    ddd += 'main_title_slide "' + u.escape(page.name) + '",\n';
    if (page.title != '')
    {
        ddd += '    title\n';
        ddd += '        text "' + u.escape(page.title) + '"\n';
        empty = false;
    }
    if (page.subtitle != '')
    {
        ddd += '    subtitle\n';
        ddd += u.htmlToSlideContent(page.subtitle, 2);
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
