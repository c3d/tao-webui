// Form field thats uses ImageLibrary to enable the user to select an image
Ext.define('TE.view.MultiviewImagePickerField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.temvimagepickerfield',

    onTriggerClick: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Select multiview image'),
            showChooseButton: true,
            targetField: this,
            type: 'mvimage',
            store: 'MultiviewImages'
        });
    }
});
