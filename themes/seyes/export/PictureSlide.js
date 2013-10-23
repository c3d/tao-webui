var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('SeyesTheme'),
    generate: s.generatePictureSlide('Seyes')
}
