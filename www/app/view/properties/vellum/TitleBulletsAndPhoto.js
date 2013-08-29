// http://www.sencha.com/forum/showthread.php?142836-HTML-Editor-focus-and-blur-event-issue
Ext.define('TE.form.field.HtmlEditor', {
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

Ext.define('TE.view.properties.vellum.TitleBulletsAndPhoto', {
    extend: 'Ext.Container',

    initComponent: function() {

        this.items = [
            {
                xtype: 'form',
                border: 0,
                padding: 10,

                defaults: {
                    labelAlign: 'top',
                    labelPad: 10,
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'name',
                        fieldLabel: 'Page name'
                    },
                    {
                        xtype: 'customhtmleditor',
                        name: 'properties~bullets',
                        fieldLabel: 'Bullet text'
                    },
                    {
                        xtype: 'textfield',
                        name: 'properties~photo',
                        fieldLabel: 'Photo'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }
});
