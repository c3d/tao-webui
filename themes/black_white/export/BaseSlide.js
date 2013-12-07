var s = require(__dirname + '/../../common/export/slides');

module.exports = {
    header:   s.importHeader('BlackAndWhiteThemes'),
    generate: function(page) {
        return s.generateBaseSlide(page.theme)(page);
    }
}
