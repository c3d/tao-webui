var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['FinanceTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("Finance")
}
