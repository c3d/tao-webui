// Return the config object for a Combo box with all the variations for
// theme 'Black and White'
Ext.define('TE.themes.black_white.view.properties.ThemeComboMixin', {
    requires: ['Ext.data.Store'],

    getThemeComboCfg: function() {
        var themes = Ext.create('Ext.data.Store', {
            fields: ['abbr', 'name'],
            data : [
                {abbr:"BlackOnWhite",   name:tr('Black on White',   'black_white')},
                {abbr:"WhiteOnBlack",   name:tr('White on Black',   'black_white')},
                {abbr:"BlackOnGray",    name:tr('Black on Gray',    'black_white')},
                {abbr:"WhiteOnGray",    name:tr('White on Gray',    'black_white')},
                {abbr:"BlackOnPicture", name:tr('Black on Picture', 'black_white')},
                {abbr:"WhiteOnPicture", name:tr('White on Picture', 'black_white')},
            ]
        });

        return {
                xtype: 'combobox',
                store: themes,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'abbr',
                editable: false,
                autoSelect: true,

                name: 'theme',
                fieldLabel: tr('Sub-theme', 'black_white')
        };
    }
});
