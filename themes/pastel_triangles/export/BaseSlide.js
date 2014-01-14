var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['PastelTrianglesTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("PastelTriangles")
}
