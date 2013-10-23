var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['SeyesTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("Seyes")
}
