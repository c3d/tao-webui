var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['FinanceTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("Finance")
}
