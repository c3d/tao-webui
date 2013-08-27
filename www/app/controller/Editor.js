Ext.define('TE.controller.Editor', {
    extend: 'Ext.app.Controller',

    stores: [ 'Pages' ],
    models: [ 'Page' ],
    views: [
        'Editor',
        'PageList',
        'Tools'
    ],

    init: function() {
        this.control({
            'imageandcaption': {
                // All icons
                click: this.selectOnly
            },
            'theme': {
                click: this.themeClicked
            }
        });
        this.getPagesStore().on({ 'load': this.showPages });
    },

    themeClicked: function(icon) {
        var tools = icon.up('tools'); // REVISIT? tools !== this.getToolsView(). Why?
        tools.setPageTemplates(icon.getPageTemplatesPanel());

        Ext.each(Ext.ComponentQuery.query('theme'), function(child) {
            child.toggleCurrentTheme(child === icon);
        });

        //TESTING
        // var store = this.getPagesStore();
        // var newpage = Ext.create('TE.model.Page', { name: 'Nouvelle page', ptclass: '' });
        // newpage.save(); // POST
        // var first = store.first();
        // first.set('name', 'Modified');
        // first.save(); // PUT
        // var last = this.getPagesStore().last();
        // last.destroy(); // DELETE
    },

    selectOnly: function(icon) {
        Ext.each(Ext.ComponentQuery.query('imageandcaption'), function(child) {
            child.toggleSelected(child === icon);
        });
    },

    // Populate the "Pages" pane: one icon for each page loaded from the document store
    showPages: function(store, records, successful) {
        if (successful === false) {
            console.log('Failed to load document');
            return;
        }

        var name, ptclass,
            pagelist = Ext.ComponentQuery.query('pagelist')[0];
        store.each(function(page) {
            name = page.get('name');
            ptclass = page.get('ptclass');
            if (typeof ptclass !== 'undefined' && ptclass !== '') {
                pagelist.add(Ext.create(ptclass, {
                    caption: name,
                    maxCaptionLen: 18
                }));
            }
        });
    }
});
