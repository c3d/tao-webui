var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('BrightRectanglesTheme'),
    generate: s.generateBaseSlide("BrightRectangles")
}
