Ext.define('TE.controller.PageControllerBase', {
    extend: 'Ext.app.Controller',
    refs: [
        { ref: 'centerpane', selector: '#centerpane' }
    ],

    display: function(record) {
        var cp = this.getCenterpane();
        cp.removeAll();
        var vname = record.getPropertiesViewClass();
        var view = Ext.create(vname);
        cp.add(view);
        cp.down('form').loadRecord(record);
    },

    updatePage: function() {
        // Copy form values into record
        var form = this.getCenterpane().down('form');
        var record = form.getRecord();
        var values = form.getValues();
        record.set(values);
        if (record.dirty) {
            // Push modified page to server
            record.save();

            // Update page list (2 models => 2 records)
            console.log(record.getChanges());
            record.generic_record.set(record.getChanges());
            record.generic_record.commit();
        }
    }
});