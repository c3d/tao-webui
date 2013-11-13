var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['BlackAndWhiteThemes', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("BlackOnWhite")
}
