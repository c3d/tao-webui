Ext.define('TE.view.PageTemplate', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.pagetemplate',

    image: '',
    caption: 'Caption not set',

    initComponent: function() {
        this.callParent(arguments);
    },

    getModelClassName: function()
    {
        return 'TE.editor.model.BaseSlide';
    },

    createPage: function()
    {
        var model = this.getModelClassName();
        var path = this.fullPageTemplate || '';
        var page = Ext.create(model);
        page.set('model', path);
        return page;
    }
 });
