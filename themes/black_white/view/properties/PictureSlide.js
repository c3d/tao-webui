Ext.define('TE.themes.black_white.view.properties.PictureSlide', {
    extend: 'TE.themes.common.view.properties.PictureSlide',
    mixins: ['TE.themes.black_white.view.properties.ThemeComboMixin'],

    initComponent: function() {
        this.callParent([ [ this.getThemeComboCfg() ] ]);
    }
});
