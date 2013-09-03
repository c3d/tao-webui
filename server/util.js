function escape(txt)
{
    return txt.replace(/"/g, '""');
}

module.exports = {
	escape: escape
}