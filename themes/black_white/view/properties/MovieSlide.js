Ext.define('TE.themes.black_white.view.properties.MovieSlide', {
    extend: 'TE.themes.common.view.properties.MovieSlide',
    mixins: ['TE.themes.black_white.view.properties.ThemeComboMixin'],

    initComponent: function() {
        this.callParent([ [ this.getThemeComboCfg() ] ]);
    }
});
