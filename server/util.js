function escape(txt)
{
    return txt.replace('"', '""');
}

module.exports = {
	escape: escape
}