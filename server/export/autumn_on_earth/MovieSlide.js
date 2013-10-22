var s = require(__dirname + '/../../slides');

module.exports = {
    header:   s.importHeaders(['AutumnOnEarthTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("AutumnOnEarth")
}
