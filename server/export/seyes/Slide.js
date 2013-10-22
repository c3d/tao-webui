var u = require(__dirname + '/../../util');

function header(ctx)
{
    if (ctx.hasOwnProperty('seyes'))
        return '';
    ctx['seyes'] = 1;
    return 'import SeyesTheme\n';
}

function esc_html(txt)
{
    return u.escape(txt).replace(/\n/g, ' ');
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "Seyes"\n'
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
