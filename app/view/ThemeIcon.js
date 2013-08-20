Ext.define('TE.view.ThemeIcon', {
    extend: 'TE.view.ImageAndCaption',
    alias: 'widget.themeicon',

    // Name of the class to instanciate to fill the 'page templates' panel
    ptclassname: 'TE.view.vellum.PageTemplates',
    pt: null,

    constructor: function() {
        this.callParent(arguments);

    },

    initComponent: function(config) {
        console.log('view.Theme initComponent');
        this.callParent(arguments);
     },

     getPageTemplatesPanel: function() {
        return (Ext.create(this.ptclassname));
     }
 });
