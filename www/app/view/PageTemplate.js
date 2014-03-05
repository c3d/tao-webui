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
        var kind = model.replace('TE.themes.','').replace('.model','');
        page.set('path', path);
        page.set('kind', kind);
        return page;
    }
 });
