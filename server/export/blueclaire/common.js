function header(ctx)
{
    if (ctx.hasOwnProperty('blueclaire'))
        return '';
    ctx['blueclaire'] = 1;
	return 'import BlueClaireTheme\n';
}

module.exports = {
	header: header
}