var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['SeasonsGreetingsTheme', 'Charts', 'VLCAudioVideo']),
    generate: s.generateBaseSlide("SeasonsGreetings")
}
