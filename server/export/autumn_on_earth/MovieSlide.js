var u = require(__dirname + '/../../util');

module.exports = {
    header:   u.importHeaders(['AutumnOnEarthTheme', 'VLCAudioVideo']),
    generate: u.generateMovieSlide("AutumnOnEarth")
}
