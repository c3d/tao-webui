var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['AutumnOnEarthTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("AutumnOnEarth")
}
