var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('SeasonsGreetingsTheme'),
    generate: s.generatePictureSlide('SeasonsGreetings')
}
