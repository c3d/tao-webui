var esc = require('../../util').escape;
var header = require('./common.js').header;

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "BlueClaire"\n'
    ddd += 'section_slide "' + esc(page.name) + '",\n';
    if (page.title != '')
    {
    	ddd += '    title\n';
    	ddd += '        text "' + esc(page.title) + '"\n';
        empty = false;
    }
    if (page.subtitle != '')
    {
    	ddd += '    subtitle\n';
    	ddd += '        text "' + esc(page.subtitle) + '"\n';
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
