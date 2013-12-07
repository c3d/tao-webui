var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('LuckyStarsTheme'),
    generate: s.generateSectionSlide('LuckyStars')
}
