var u = require(__dirname + '/../../util');

module.exports = {
    header:   u.importHeaders(['BlueClaireTheme', 'VLCAudioVideo']),
    generate: u.generateMovieSlide("BlueClaire")
}
