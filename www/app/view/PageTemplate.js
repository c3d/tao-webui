Ext.define('TE.view.PageTemplate', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.pagetemplate',

    getModelClassName: function() {
        // Example : TE.view.vellum.TitleAndSubtitle => TE.model.vellum.TitleAndSubtitle
        return this.self.getName().replace('view', 'model');
    }
 });
