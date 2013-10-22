var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['AutumnOnEarthTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("AutumnOnEarth")
}
