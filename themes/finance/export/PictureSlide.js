var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('FinanceTheme'),
    generate: s.generatePictureSlide('Finance')
}
