Ext.define('TE.view.ThemeIcon', {
    extend: 'TE.view.ImageAndCaption',

    xtype: 'themeicon',
    // Name of the class to instanciate to fill the 'page templates' panel
    ptclassname: '',
    // Cached instance
    pt: null,

    // constructor: function() {
    //     this.callParent(arguments);
    // },

    // initComponent: function(config) {
    //     console.log('view.Theme initComponent');
    //     this.callParent(arguments);
    //  },

     getPageTemplatesPanel: function() {
        // TODO cache
        console.log('this.ptclassname = ', this.ptclassname);
        return (Ext.create(this.ptclassname));
     }
 });
