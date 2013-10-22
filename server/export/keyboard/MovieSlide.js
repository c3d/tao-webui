var s = require(__dirname + '/../../slides');

module.exports = {
    header:   s.importHeaders(['KeyboardTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("Keyboard")
}
