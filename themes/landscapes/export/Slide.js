var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('LandscapesTheme'),
    generate: s.generateSlide('Landscapes')
}
