var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('KeyboardTheme'),
    generate: s.generateBaseSlide("Keyboard")
}
