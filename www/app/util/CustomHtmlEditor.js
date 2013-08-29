// http://www.sencha.com/forum/showthread.php?142836-HTML-Editor-focus-and-blur-event-issue
Ext.define('TE.util.CustomHtmlEditor', {
    extend: 'Ext.form.field.HtmlEditor',
    alias: 'widget.customhtmleditor',

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
