// ============================================================================
// 
//   Generate default fields for a new page
// 
// ============================================================================

var result = '';

function beginFields()
// ----------------------------------------------------------------------------
//    Create an empty list of properties
// ----------------------------------------------------------------------------
{
    result = '';
}


function endFields()
// ----------------------------------------------------------------------------
//   Wrap a list of properties, JSON style
// ----------------------------------------------------------------------------
{
    result = '{' + result + '}';
    return result;
}


function property(name, value)
// ----------------------------------------------------------------------------
//   Add a property to the properties of the objec
// ----------------------------------------------------------------------------
{
    return function(page, indent) {
        var field = '"' + name + '":' + value;
        
        if (result.length > 0)
            result = result + ',' + field;
        else
            result = field;
        return '';
    }
}


module.exports = {
    beginFields:        beginFields,
    endFields:          endFields,
    property:           property
}
