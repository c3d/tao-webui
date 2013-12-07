Ext.define('TE.themes.black_white.view.properties.SectionSlide', {
    extend: 'TE.themes.common.view.properties.SectionSlide',
    mixins: ['TE.themes.black_white.view.properties.ThemeComboMixin'],

    initComponent: function() {
        this.callParent([ [ this.getThemeComboCfg() ] ]);
    }
});
