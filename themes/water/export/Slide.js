var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('WaterTheme'),
    generate: s.generateSlide('Water')
}
