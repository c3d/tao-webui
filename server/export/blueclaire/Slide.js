var esc = require('../../util').escape;
var htmlToSlideContent = require('../../util').htmlToSlideContent;
var header = require('./common.js').header;

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
