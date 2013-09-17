var esc = require('../../util').escape;
var htmlToSlideContent = require('../../util').htmlToSlideContent;

function header(ctx)
{
    if (ctx.hasOwnProperty('blueclaire'))
        return '';
    ctx['blueclaire'] = 1;
    return 'import BlueClaireTheme\n';
}

function esc_html(txt)
{
    return esc(txt).replace(/\n/g, ' ');
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "BlueClaire"\n'
    ddd += 'slide "' + esc(page.name) + '",\n';
    if (page.text != '')
    {
        ddd += htmlToSlideContent(page.text);
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
