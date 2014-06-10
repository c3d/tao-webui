// Form field that uses ImageLibrary to enable the user to select an image
Ext.define('TE.view.ImagePickerField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.teimagepickerfield',

    onTriggerClick: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Select image'),
            showChooseButton: true,
            targetField: this,
            type: 'image',
            store: 'Images'
        });
    }
});
