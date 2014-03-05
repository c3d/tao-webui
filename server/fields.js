// ============================================================================
// 
//   Generate default fields for a new page
// 
// ============================================================================

var result = '';

function beginFields()
{
    result = '';
}


function endFields() {
    if (result.length > 0)
        result = '{' + result + '}';
    return result;
}


function addField(field)
{
    if (field.length > 0)
    {
        if (result.length > 0)
            result = result + ',' + field;
        else
            result = field;
    }
}


function needTitle(page)
{
    addField('"title":"Insert title"');
    addField('"subtitle":"Insert subtitle"');
}


function needStory(page)
{
    addField('"story":"Insert your story here"');
}


function needDynamicFields(page) {}
function needTextBoxes(page) {}


function needLeftColumn(page)
{
    addField('"left_column":"Insert left column text here"');
}


function needRightColumn(page)
{
    addField('"right_column":"Insert right column text here"');
}


function needColumns(page)
{
    needLeftColumn(page);
    needRightColumn(page);
}


function needPictures(kind, picture)
{
    addField('"picture_1":{"picture_1":"http://www.taodyne.com/presentation/images/Taodyne.png","picscale_1":100,"picx_1":0,"picy_1":0}');
}


function needMovies(page)
{
    addField('"movie_1":{"movie_1":"http://www.youtube.com/watch?v=TbMKCN2-GPk","moviescalepercent_1":100,"moviex_1":0,"moviey_1":0}');
}


function needPage(page)
{
    needTitle(page);
    needStory(page);
}


module.exports = {
    beginFields:        beginFields,
    endFields:          endFields,

    needTitle:          needTitle,
    needStory:          needStory,
    needLeftColumn:     needLeftColumn,
    needRightColumn:    needRightColumn,
    needColumns:        needColumns,
    needPictures:       needPictures,
    needMovies:         needMovies,
    needPage:           needPage
}
