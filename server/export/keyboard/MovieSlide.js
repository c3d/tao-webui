var u = require(__dirname + '/../../util');

module.exports = {
    header:   u.importHeaders(['KeyboardTheme', 'VLCAudioVideo']),
    generate: u.generateMovieSlide("Keyboard")
}
