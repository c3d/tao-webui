Ext.define('TE.util.HtmlEditor', {
    extend: 'Ext.ux.form.field.TinyMCE',
    alias: 'widget.te_htmleditor',

    config: {
        layout: 'fit'
    },

    tinymceConfig: {
        plugins: 'save,searchreplace',
        theme_advanced_buttons1: 'undo,redo,|,' +
                                 'fontselect,fontsizeselect,|,' +
                                 'bold,italic,underline,strikethrough,|,' +
                                 'forecolor,|,charmap,|,removeformat,|,code',
        theme_advanced_buttons2: 'bullist,numlist,|,outdent,indent,|,' +
                                 'justifyleft,justifycenter,justifyright,justifyfull',
        theme_advanced_buttons3: '',
        theme_advanced_buttons4: '',
        theme_advanced_font_sizes: '10pt,12pt,14pt,18pt,24pt,36pt,48pt',
        font_size_style_values: '10pt,12pt,14pt,18pt,24pt,36pt,48pt',
        content_css : 'tinymce_content.css' // override some defaults (default font size)
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

        var me = this;
        this.tinymceConfig.save_onsavecallback = function() {
            me.fireEvent('savecurrentpage');
            return false;
        }

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
