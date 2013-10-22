var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('AutumnOnEarthTheme'),
    generate: s.generateSlide('AutumnOnEarth')
}
