Ext.define('TE.controller.PageControllerBase', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'centerpane', selector: '#centerpane' },
        { ref: 'properties', selector: '#properties' },
        { ref: 'addMenu', selector: '#add_menu' }
    ],

    timer: 0, // !== 0 if timer is running

    display: function(record) {
        // var cp = this.getCenterpane();
        // cp.removeAll();
        var pp = this.getProperties();
        pp.removeAll();
        var addMenu = this.getAddMenu();
        addMenu.removeAll();
        var vname = record.getPropertiesViewClass();
        var view = Ext.create(vname);
        pp.add(view);
        pp.down('form').loadRecord(record);
        if (this.timer !== 0)
            this.endDisplay();
        this.startSaveTimer();
    },

    endDisplay: function() {
        if (this.timer !== 0) {
            clearTimeout(this.timer);
            this.timer = 0;
        }
    },

    // Save page immediately, if modified
    updatePage: function() {
        var me = this;

        // Copy form values into record
        var form = me.getProperties().down('form');
        if (!form || !form.isValid())
            return;

        var record = form.getRecord();
        var values = form.getValues();
        record.set(values);
        if (record.dirty) {
            me.getCenterpane().fireEvent('saving');
            var changes = record.getChanges();
            record.generic_record.set(changes);
            // For each modified field, update its .originalValue so
            // the 'pagename' vtype (duplicate check) will work correctly
            form.getForm().getFields().each(function(field) {
                if (field.name in changes)
                    field.resetOriginalValue();
                return true;
            });
            // Push modified page to server
            record.save({
                success: function() {
                    record.generic_record.commit();
                    me.startSaveTimer();
                    me.getCenterpane().fireEvent('saved');
                }
                // Note: failure is handled at the proxy level (model/Pages.js)
            });
        } else {
            me.startSaveTimer();
        }
    },

    startSaveTimer: function() {
        if (this.timer !== 0)
            return;
        this.timer = Ext.defer(function() {
            this.timer = 0;
            this.updatePage();
        }, 10000, this);
    }
});
