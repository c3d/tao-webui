var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['LandscapesTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("Landscapes")
}
