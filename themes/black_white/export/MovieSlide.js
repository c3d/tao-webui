var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['BlackAndWhiteThemes', 'VLCAudioVideo']),
    generate: function(page) {
        return s.generateMovieSlide(page.theme)(page);
    }
}
