// Form field thats uses ImageLibrary to enable the user to select an image
Ext.define('TE.view.ModelPickerField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.temodelpickerfield',

    onTriggerClick: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Select 3D model'),
            showChooseButton: true,
            targetField: this,
            type: 'model',
            store: 'Models'
        });
    }
});
