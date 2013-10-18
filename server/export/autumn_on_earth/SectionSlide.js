var u = require(__dirname + '/../../util');

function header(ctx)
{
    if (ctx.hasOwnProperty('autumn_on_earth'))
        return '';
    ctx['autumn_on_earth'] = 1;
    return 'import AutumnOnEarthTheme\n';
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "AutumnOnEarth"\n'
    ddd += 'section_slide "' + u.escape(page.name) + '",\n';
    if (page.title != '')
    {
        ddd += '    title\n';
        ddd += '        text "' + u.escape(page.title) + '"\n';
        empty = false;
    }
    if (page.subtitle != '')
    {
        ddd += '    subtitle\n';
        ddd += '        text "' + u.escape(page.subtitle) + '"\n';
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
