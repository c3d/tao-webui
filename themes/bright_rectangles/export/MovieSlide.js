var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['BrightRectanglesTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("BrightRectangles")
}
