Ext.define('TE.view.Theme', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.theme',

    getPageTemplatesPanel: function() {
        if (typeof this.self.pt === 'undefined') {
            var pageTemplates = this.pageTemplates;
            // Create and cache instance
            if (pageTemplates)
                this.self.pt = Ext.create('TE.view.PageTemplates', {
                    requires: 'TE.view.PageTemplate',
                    title: this.caption,
                    dockedItems: [],
                    initComponent: function() {
                        var items = [];
                        Ext.Array.forEach(pageTemplates, function(name) {
                            items.push(Ext.create('TE.view.PageTemplate', {
                                image: 'app/themes/' + name + '.pt.png',
                                caption: name
                            }), this);
                        });
                        this.items = items;
                        this.callParent(arguments);
                    }
                });
            else
                this.self.pt = Ext.create(this.self.ptclassname);
            console.log (this.self.pt);
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
