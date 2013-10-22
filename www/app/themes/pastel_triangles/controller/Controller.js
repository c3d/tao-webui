Ext.define('TE.themes.pastel_triangles.controller.Controller', {
    extend: 'TE.controller.PageControllerBase',

    requires: [
        'TE.themes.pastel_triangles.model.MainTitleSlide',
        'TE.themes.pastel_triangles.model.SectionSlide',
        'TE.themes.pastel_triangles.model.PictureSlide',
        'TE.themes.pastel_triangles.model.MovieSlide',
        'TE.themes.pastel_triangles.model.Slide',

        'TE.themes.pastel_triangles.view.properties.MainTitleSlide',
        'TE.themes.pastel_triangles.view.properties.SectionSlide',
        'TE.themes.pastel_triangles.view.properties.PictureSlide',
        'TE.themes.pastel_triangles.view.properties.MovieSlide',
        'TE.themes.pastel_triangles.view.properties.Slide'
    ]
});
