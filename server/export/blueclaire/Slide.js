var esc = require('../../util').escape;
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
        // FIXME page.text is HTML
    	ddd += '    text "' + esc_html(page.text) + '"\n';
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
