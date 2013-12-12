Ext.define('TE.view.PageTemplate', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.pagetemplate',

    getModelClassName: function() {
        // Example : TE.themes.vellum.view.TitleAndSubtitle => TE.themes.vellum.model.TitleAndSubtitle
        return this.self.getName().replace('.view.', '.model.');
    }
 });
