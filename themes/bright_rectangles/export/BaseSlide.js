var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['BrightRectanglesTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("BrightRectangles")
}
