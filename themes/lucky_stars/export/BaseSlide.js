var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['LuckyStarsTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("LuckyStars")
}
