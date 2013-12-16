Ext.define('TE.themes.black_white.view.properties.Slide', {
    extend: 'TE.themes.common.view.properties.Slide',
    mixins: ['TE.themes.black_white.view.properties.ThemeComboMixin'],

    initComponent: function() {
        this.callParent([ [ this.getThemeComboCfg() ] ]);
    }
});