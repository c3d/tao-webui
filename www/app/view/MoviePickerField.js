// form field thats uses ImageLibrary to enable the user to select an image
Ext.define('TE.view.MoviePickerField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.temoviepickerfield',

    onTriggerClick: function() {
        Ext.widget('teresourcelibrary', {
            title: tr('Select movie'),
            showChooseButton: true,
            targetField: this,
            type: 'movie',
            store: 'Movies'
        });
    }
});
