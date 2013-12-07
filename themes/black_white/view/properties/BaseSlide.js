Ext.define('TE.themes.black_white.view.properties.BaseSlide', {
    extend: 'TE.themes.common.view.properties.BaseSlide',
    mixins: ['TE.themes.black_white.view.properties.ThemeComboMixin'],

    initComponent: function() {
        this.callParent([ [ this.getThemeComboCfg() ] ]);
    }
});
