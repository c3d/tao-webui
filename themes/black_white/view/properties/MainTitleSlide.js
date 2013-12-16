Ext.define('TE.themes.black_white.view.properties.MainTitleSlide', {
    extend: 'TE.themes.common.view.properties.MainTitleSlide',
    mixins: ['TE.themes.black_white.view.properties.ThemeComboMixin'],

    initComponent: function() {
        this.callParent([ [ this.getThemeComboCfg() ] ]);
    }
});