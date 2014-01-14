var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['LandscapesTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("Landscapes")
}
