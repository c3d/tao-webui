var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['SeyesTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("Seyes")
}
