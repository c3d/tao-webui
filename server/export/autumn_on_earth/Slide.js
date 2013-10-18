var u = require(__dirname + '/../../util');

function header(ctx)
{
    if (ctx.hasOwnProperty('autumn_on_earth'))
        return '';
    ctx['autumn_on_earth'] = 1;
    return 'import AutumnOnEarthTheme\n';
}

function esc_html(txt)
{
    return u.escape(txt).replace(/\n/g, ' ');
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "AutumnOnEarth"\n'
    ddd += 'slide "' + u.escape(page.name) + '",\n';
    if (page.text != '')
    {
        ddd += u.htmlToSlideContent(page.text);
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
