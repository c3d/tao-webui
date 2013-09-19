Ext.define('TE.i18n.Translate', {
    singleton: true,
    lang: 'en',

    translations: [],

    // Return a translation function that will reflect the current language
    // at the time it is called
    // tr('source text' [, 'context'])
    getTr: function() {
        var me = this;

        return function(txt, ctx) {
            if (me.lang == 'en')
                return txt;

            for (var i = 0; i < me.translations.length; i++) {
                var trans = me.translations[i];
                if (trans.hasOwnProperty(txt))
                {
                    var t = trans[txt];
                    if (typeof ctx !== 'undefined')
                    {
                        if (t && t.hasOwnProperty(ctx))
                            return t[ctx] || txt;
                    }
                    else
                    {
                        if (typeof t === 'string')
                            return t;
                        if (t === null)
                            return txt;
                    }
                }
            }
            
            console.log('No \'' + me.lang + '\' translation for: [' + txt + ']');
            return txt;
        };
    },

    // Example:
    //   register({'Name': 'Nom' });
    //   register({'Name': {'user': 'Identifiant'}, 'Name': {'file': 'Chemin' } });
    //   tr('Name') // = 'Nom'
    //   tr('Name', 'user')  // = 'Identifiant'
    //   tr('Name', 'file')  // = 'Chemin'
    register: function(trans) {
        this.translations.push(trans);
    }
});
