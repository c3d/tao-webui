Ext.define('TE.themes.seasons_greetings.view.Theme', {
    extend: 'TE.themes.common.view.Theme',
    requires: ['TE.i18n.Translate'],

    statics: {
        ptclassname: 'TE.themes.seasons_greetings.view.PageTemplates'
    },
    image: 'app/themes/seasons_greetings/resources/images/seasons_greetings.png',

    initComponent: function() {
        var trans = TE.i18n.Translate;
        if (trans.lang === 'fr') {
            trans.register(Ext.create('TE.themes.seasons_greetings.i18n.fr').translations, 'seasons_greetings');
        }
        this.caption = tr('Seasons Greetings', 'seasons_greetings');
        this.callParent(arguments);
    }
 });
