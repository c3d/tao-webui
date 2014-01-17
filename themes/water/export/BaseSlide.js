var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['WaterTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("Water")
}
