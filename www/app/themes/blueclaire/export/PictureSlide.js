var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('BlueClaireTheme'),
    generate: s.generatePictureSlide('BlueClaire')
}
