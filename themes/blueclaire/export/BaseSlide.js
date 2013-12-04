var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['BlueClaireTheme', 'Charts']),
    generate: s.generateBaseSlide("BlueClaire")
}
