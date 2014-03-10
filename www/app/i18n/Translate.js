// Example:
//   register({'Name': 'Nom' });
//   register({'Name': { 'default': 'NOM', 'user': 'Identifiant'} }, 'mymodule');
//   tr('Name') // = 'Nom'
//   tr('Name', 'mymodule')  // = 'NOM'
//   tr('Name', 'mymodule', 'user')  // = 'Identifiant'

Ext.define('TE.i18n.Translate', {
    singleton: true,
    lang: 'en',

    translations: {},

    // Return the translation function
    getTr: function() {
        var me = this;

        return function(txt, module, variant) {
            if (me.lang == 'en')
                return txt;

            module = module || 'common';

            if (me.translations.hasOwnProperty(module) &&
                me.translations[module].hasOwnProperty(txt)) {

                var trans = me.translations[module][txt]; // string or null or object
                if (typeof variant === 'undefined' || variant === 'default')
                {
                    if (typeof trans === 'string')
                        return trans;
                    if (trans === null)
                        return txt;
                    variant = 'default';
                }
                if (trans.hasOwnProperty(variant))
                {
                    if (typeof trans[variant] === 'string')
                        return trans[variant];
                    if (trans[variant] === null)
                        return txt;
                }
            }
            
            console.log("No '" + me.lang + "' translation for: [" + txt +
                        "] (variant '" + (variant || 'default') + "' in module '" +
                        module + "')");
            return txt;
        };
    },

    // Add translations
    register: function(trans, modulename) {
        modulename = modulename || 'default';
        if (this.translations.hasOwnProperty(modulename))
            return false;
        this.translations[modulename] = trans;
    }
});
