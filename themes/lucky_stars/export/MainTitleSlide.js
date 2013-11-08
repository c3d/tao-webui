var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('LuckyStarsTheme'),
    generate: s.generateMainTitleSlide("LuckyStars")
}
