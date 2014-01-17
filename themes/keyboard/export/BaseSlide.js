var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['KeyboardTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("Keyboard")
}
