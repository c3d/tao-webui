Ext.define('TE.view.PageTemplate', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.pagetemplate',

    image: '',
    caption: 'Caption not set',

    initComponent: function() {
        this.callParent(arguments);
    },

    getModelClassName: function() {
        if (this.pageTemplate) {
            // New case: we have a dynamically defined page template name
            // We use the common theme
            return 'TE.themes.common.model.BaseSlide';
        }

        // Old case: we have a statically defined page template name
        // Example : TE.themes.vellum.view.TitleAndSubtitle
        //        => TE.themes.vellum.model.TitleAndSubtitle
        return this.self.getName().replace('.view.', '.model.');
    },

    createPage: function() {
        var model = this.getModelClassName();
        var path = this.fullPageTemplate || '';
        var page = Ext.create(model);
        var kind = model.replace('TE.themes.','').replace('.model','');
        page.set('path', path);
        page.set('kind', kind);
        return page;
    }
 });
