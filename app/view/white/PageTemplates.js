Ext.define('TE.view.white.PageTemplates', {
    extend: 'TE.view.PageTemplates',
    requires: 'TE.view.PageTemplate',

    title: tr('Page Templates (White)'),

    initComponent: function() {
        var tmpls = [{
            image: 'title_and_subtitle.png',
            caption: tr('Title & Subtitle')
        }, {
            image: 'title_and_bullets.png',
            caption: tr('Title & Bullets')
        }, {
            image: 'title_bullets_and_photo.png',
            caption: tr('Title, Bullets & Photo')
        }, {
            image: 'photo_horizontal.png',
            caption: tr('Photo &ndash; Horizontal')
        }, {
            image: 'blank.png',
            caption: tr('Blank')
        }];

        this.items = []; // REVISIT?
        Ext.Array.forEach(tmpls, function(t) {
            this.items.push({
                xtype: 'pagetemplate',
                image: 'app/assets/images/white/' + t.image,
                caption: t.caption });
        }, this);

        this.callParent(arguments);
    }
});
