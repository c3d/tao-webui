var s = require(__dirname + '/../../common/export/slides');
var util = require(__dirname + '/../../common/export/util');

function generateTextCrawl(page) {
    var empty = true;
    var ddd = '';
    ddd += util.theme(page.ctx, 'LuckyStars');
    ddd += 'picture_slide "' + util.escape(page.name) + '",\n';
    if (page.text != '')
    {
        ddd += "    mc_size 1200, 2000\n" +
               "    mc_star_wars_crawl " + page.crawl_duration + ",\n";
        ddd += util.htmlToSlideContent(page.text, 2);
        empty = false;
    }
    if (empty)
        ddd += '    nil\n';
    return ddd;
}

module.exports = {
    header:   s.importHeaders(['LuckyStarsTheme', 'MovieCredits']),
    generate: generateTextCrawl
}
