var s = require(__dirname + '/../../slides');

module.exports = {
    header:   s.importHeaders(['BlueClaireTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("BlueClaire")
}
