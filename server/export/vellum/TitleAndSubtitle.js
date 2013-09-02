var esc = require('../../util').escape;

function generate(page)
{
	var ddd = '';
    ddd += 'page "' +  esc(page.name) + '",\n';
    ddd += '    text_box 0, 0, 0.8 * window_width, 0.9 * window_height,\n';
    ddd += '        text "' + esc(page.title) + '"\n';
    ddd += '        line_break\n';
    ddd += '        text "' + esc(page.subtitle) + '"\n';
    return ddd;
}

module.exports = {
	generate: generate
}
