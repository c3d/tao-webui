var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['KeyboardTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("Keyboard")
}
