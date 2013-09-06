// http://www.sencha.com/forum/showthread.php?142836-HTML-Editor-focus-and-blur-event-issue
Ext.define('TE.util.CustomHtmlEditor', {
    extend: 'Ext.form.field.HtmlEditor',
    alias: 'widget.customhtmleditor',

    fontFamilies: [
        // Special font name that will be recognized by the code generator
        tr('_Theme default_'),

        // Default fonts proposed by HtmlEditor
        // FIXME: How can we add the fonts available on the system?
        // Maybe we could ask the NodeJS server (assuming it is running
        // on the same machine as Tao).
        'Arial',
        'Courier New',
        'Helvetica',
        'Tahoma',
        'Times New Roman',
        'Verdana',

        // Fonts bundled with Tao
        // FIXME: except for fonts that are also installed system-wide,
        // these fonts cannot be used in the web browser. User will see
        // a default font instead. But Tao will display the correct font.
        // Maybe the NodeJS server could implement a font server?
        // - Serif
        'Bentham',
        'Gentium Plus',
        'Goudy Bookletter 1911',
        'IM FELL English',
        'IM FELL English SC',
        'Old Standard TT',
        'PT Serif',
        // - Sans-serif
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
    ],

    // Array of font family names. The first one that is present in
    // fontFamilies will be selected on creation.
    dfltFont: [ tr('_Theme default_') ],

    listeners: {
        afterrender: function(c) {
            if (this.dfltFont)
            {
                for (var i = 0; i < c.dfltFont.length; i++)
                {
                    var name = c.dfltFont[i];
                    if (c.fontFamilies.indexOf(name) !== -1)
                    {
                        c.relayCmd('fontName', name);
                        break;
                    }
                }
            }
        }
    },

    initEvents: function () {
        this.callParent(arguments);
        this.on({
            scope: this,
            initialize: this.onInitializeHtmlEditor
        });
    },

    onInitializeHtmlEditor: function () {
        var frameWin = this.getWin(),
            fn = Ext.bind(this.onHtmlEditorBlur, this);

        if (frameWin.attachEvent)
            frameWin.attachEvent('blur', fn);
        else
            frameWin.addEventListener('blur', fn, false);
    },

    onHtmlEditorBlur: function(e) {
        this.fireEvent('blur', this);
    }
});
