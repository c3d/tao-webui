// Custom form field thats uses ImageLibrary to enable the user to select an image
Ext.define('TE.view.VideoPickerField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.tevideopickerfield',

    onTriggerClick: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Select video'),
            showChooseButton: true,
            targetField: this,
            type: 'video',
            store: 'Videos'
        });
    }
});