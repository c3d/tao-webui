var u = require(__dirname + '/../../util');

function header(ctx)
{
    var hdr = '';
    if (!ctx.hasOwnProperty('blueclaire'))
    {
        hdr += 'import BlueClaireTheme\n'
        ctx['blueclaire'] = 1;
    }
    if (!ctx.hasOwnProperty('VLCAudioVideo'))
    {
        hdr += 'import VLCAudioVideo\n'
        ctx['VLCAudioVideo'] = 1;
    }
    return hdr;
}

function generate(page)
{
    var empty = true;
    var ddd = '';
    ddd += 'theme "BlueClaire"\n'
    ddd += 'picture_slide "' + u.escape(page.name) + '",\n';
    if (page.movie != '')
    {
        ddd += '    locally\n';
        ddd += '        color "white"\n';
        ddd += '        movie ' + page.moviex + ', ' + page.moviey + ', ' + page.moviescalepercent + '%, ' + page.moviescalepercent + '%, "' + page.movie + '"\n';
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
