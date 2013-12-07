var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['LuckyStarsTheme', 'VLCAudioVideo']),
    generate: s.generateMovieSlide("LuckyStars")
}
