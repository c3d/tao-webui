var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeaders(['BlackAndWhiteThemes', 'Charts', 'VLCAudioVideo']),
    generate: function(page) {
        return s.generateBaseSlide(page.theme)(page);
    }
}
