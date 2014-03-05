// Base class for several themes.
// Avoids code duplication:
//  - centralize translations
//  - provide base classes for page properties views
Ext.define('TE.editor.view.Theme', {
    extend: 'TE.view.Theme',
    requires: ['TE.i18n.Translate'],

    initComponent: function()
    {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr')
        {
            var translations = Ext.create('TE.editor.i18n.fr').translations;
            trans.register(translations,'common');
        }
        this.callParent(arguments);
    }
 });
