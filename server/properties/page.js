var fields = require('../fields');
var title = require('./title');
var subtitle = require('./subtitle');
var story = require('./story');
function pageProperties(page, indent)
{
    return title(page, indent) + subtitle(page, indent) + story(page, indent);
}
module.exports = pageProperties;
