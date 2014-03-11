Ext.define('TE.fields.angle', {
    extend: 'TE.util.CustomSliderField',
    multipleAllowed: true,
    min: -360,
    max: 360,
    step: 0.1
});
