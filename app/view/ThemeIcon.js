Ext.define('TE.view.ThemeIcon', {
    extend: 'TE.view.ImageAndCaption',

    alias: 'widget.themeicon',

    getPageTemplatesPanel: function() {
        if (typeof this.self.pt === 'undefined') {
            // Create and cache instance
            this.self.pt = Ext.create(this.self.ptclassname);
        }
        return this.self.pt;
    },

    toggleBoldCaption: function(on) {
        var cap = '';
        if (on)
            cap += '<b>';
        cap += this.caption;
        if (on)
            cap += '</b>';
        this.getComponent('caption').update(cap);
     }
 });
