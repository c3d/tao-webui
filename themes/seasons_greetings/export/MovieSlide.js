var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['SeasonsGreetingsTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("SeasonsGreetings")
}
