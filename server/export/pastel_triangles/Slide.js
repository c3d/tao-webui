var u = require(__dirname + '/../../util');

function header(ctx)
{
    if (ctx.hasOwnProperty('pastel_triangles'))
        return '';
    ctx['pastel_triangles'] = 1;
    return 'import PastelTrianglesTheme\n';
}

function esc_html(txt)
{
    return u.escape(txt).replace(/\n/g, ' ');
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "PastelTriangles"\n'
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
