Ext.define('TE.view.ThemeIcon', {
    extend: 'TE.view.ImageAndCaption',

    xtype: 'themeicon',
    // Name of the class to instanciate to fill the 'page templates' panel
    ptclassname: '',

    getPageTemplatesPanel: function() {
        return  Ext.create(this.ptclassname);
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
