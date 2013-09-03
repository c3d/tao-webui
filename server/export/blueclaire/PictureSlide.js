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
    if (page.picture != '')
    {
        ddd += '    locally\n';
        ddd += '        color "white"\n';
    	ddd += '        image 0, 0, ' + page.scalepercent + '%, ' + page.scalepercent + '%, "' + page.picture + '"\n';
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
