Ext.define('TE.view.ThemeIcon', {
    extend: 'TE.view.ImageAndCaption',

    xtype: 'themeicon',

    getPageTemplatesPanel: function() {
        if (typeof this.self.pt === 'undefined') {
            // Create and cache instance
            console.log('create ' + this.self.ptclassname);
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
