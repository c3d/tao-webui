Ext.define('TE.view.Theme', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.theme',

    getPageTemplatesPanel: function() {
        if (typeof this.self.pt === 'undefined') {
            // Create and cache instance
            var pageTemplates = this.pageTemplates;
            if (pageTemplates)
            {
                this.self.pt = Ext.create('TE.view.PageTemplates', {
                    title: this.caption,
                    pageTemplates: pageTemplates
                });
            }
            else
            {
                this.self.pt = Ext.create(this.self.ptclassname);
            }
        }
        return this.self.pt;
    },

    toggleCurrentTheme: function(on) {
        if (on)
            this.el.addCls('te-currenttheme');
        else
            this.el.removeCls('te-currenttheme');
        this.doLayout();
     }
 });
