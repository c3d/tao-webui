var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('BlackAndWhiteThemes'),
    generate: s.generateSlide('BlackOnWhite')
}
