Ext.define('TE.view.Theme', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.theme',

    getPageTemplatesPanel: function() {
        if (typeof this.self.pt === 'undefined') {
            // Create and cache instance
            this.self.pt = Ext.create(this.self.ptclassname);
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