Ext.define('TE.view.vellum.PageTemplates', {
    extend: 'TE.view.PageTemplates',

    title: tr('Page Templates (Vellum)'),

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
            image: 'blank.png',
            caption: tr('Blank')
        }];

        this.items = []; // REVISIT?
        Ext.Array.forEach(tmpls, function(t) {
            this.items.push({
                xtype: 'imageandcaption',
                image: 'app/assets/images/vellum/' + t.image,
                caption: t.caption });
        }, this);

        this.callParent(arguments);
    }
});
