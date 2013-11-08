var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['WaterTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("Water")
}
