Ext.define('TE.themes.common.view.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',
    initComponent: function() {
        this.items = [];
        this.callParent(arguments);
    }
});
