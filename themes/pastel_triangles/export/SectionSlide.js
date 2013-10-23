var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('PastelTrianglesTheme'),
    generate: s.generateSectionSlide('PastelTriangles')
}
