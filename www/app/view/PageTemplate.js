Ext.define('TE.view.PageTemplate', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.pagetemplate',

    image: '',
    caption: 'Caption not set',
    model: '',

    initComponent: function() {
        this.callParent(arguments);
    },

    getPageClassName: function()
    {
        return 'TE.editor.model.BaseSlide';
    },

    createPage: function()
    {
        var page = Ext.create(this.getModelClassName());
        page.set('model', this.model || '');
        return page;
    }
 });
