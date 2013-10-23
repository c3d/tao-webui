var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['PastelTrianglesTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("PastelTriangles")
}
