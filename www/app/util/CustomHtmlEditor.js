Ext.define('TE.util.CustomHtmlEditor', {
    extend: 'Ext.ux.form.field.TinyMCE',
    alias: 'widget.customhtmleditor',

    config: {
        height: 300
    },

    tinymceConfig: {
        plugins: 'searchreplace',
        theme_advanced_buttons1: 'undo,redo,|,' +
                                 'fontselect,fontsizeselect,|,' +
                                 'bold,italic,underline,strikethrough,|,' +
                                 'bullist,numlist,|,outdent,indent,|,' +
                                 'justifyleft,justifycenter,justifyright,justifyfull,|,' +
                                 'forecolor,|,charmap,|,removeformat,|,code',
        theme_advanced_buttons2: '',
        theme_advanced_buttons3: '',
        theme_advanced_buttons4: ''
    },

    initComponent: function() {

        // Note: if the TinyMCE language pack for 'lang' is not installed, the editor
        // will not show up. Still, I prefer not to add a hardcoded language test here
        // so that language support may be extended simply by adding files.
        this.tinymceConfig.language = TE.i18n.Translate.lang;

        this.tinymceConfig.theme_advanced_fonts =
             // The server keeps the theme's default font when first font name matches '_*_'
            tr('Theme default') + '=_theme default_,sans-serif;' +
            'Arial=arial;' +
            'Courier New=courier new;' +
            'Times New Roman=times new roman;';

        // Fonts bundled with Tao
        // FIXME: except for fonts that are also installed system-wide,
        // these fonts cannot be used in the web browser. User will see
        // a default font instead. But Tao will display the correct font.
        // Maybe the NodeJS server could implement a font server?
        var fonts = [
            // Serif
            'Bentham',
            'Gentium Plus',
            'Goudy Bookletter 1911',
            'IM FELL English',
            'IM FELL English SC',
            'Old Standard TT',
            'PT Serif',
            // Sans-serif
            'Andika Basic',
            'Cherry Cream Soda',
            'Droid Sans',
            'Droid Sans Mono',
            'Ubuntu',
            'Yanone Kaffeesatz',
            // Handwriting
            'Calligraffiti',
            'Coming Soon',
            'Dancing Script',
            'Homemade Apple',
            'Just Another Hand',
            'Kristi',
            'Tangerine',
            // Misc.
            'Allerta',
            'Chewy',
            'Geo',
            'Kenia',
            'Kranky',
            'LeckerliOne',
            'Lobster',
            'Luckiest Guy',
            'Mountains of Christmas',
            'Orbitron',
            'Permanent Marker',
            'UnifrakturMaguntia',
            'Unkempt'
        ];
        Ext.each(fonts, function(font) {
            this.tinymceConfig.theme_advanced_fonts += font + '=' + font + ',sans-serif;';
        }, this);
        this.callParent(arguments);
    }
    // initEvents: function () {
    //     this.callParent(arguments);
    //     var me = this;
    //     this.on({
    //         scope: this,
    //         editorcreated: function() {
    //             var ed = this.getEditor();
    //         }
    //     });
    // }
});
