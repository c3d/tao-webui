var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['BlueClaireTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("BlueClaire")
}
