// Base class for several themes.
// Avoids code duplication:
//  - centralize translations
//  - provide base classes for page properties views
Ext.define('TE.themes.common.view.Theme', {
    extend: 'TE.view.Theme',
    requires: ['TE.i18n.Translate'],

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.common.i18n.fr').translations, 'common');
        }
        this.callParent(arguments);
    }
 });
