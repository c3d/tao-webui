// ============================================================================
// 
//   Generate default fields for a new page
// 
// ============================================================================

var result = { };

function beginFields()
// ----------------------------------------------------------------------------
//    Create an empty list of properties
// ----------------------------------------------------------------------------
{
    result = { };
}


function endFields()
// ----------------------------------------------------------------------------
//   Wrap a list of properties, JSON style
// ----------------------------------------------------------------------------
{
    return JSON.stringify(result);
}


function property(object)
// ----------------------------------------------------------------------------
//   Add a property to the properties of the objec
// ----------------------------------------------------------------------------
{
    return function(page, indent, id) {

        // Populate the 'result' object with fields, creating unique ones
        for (field in object)
        {
            var index = 0;
            var name = field;
            while (object.hasOwnProperty(name))
            {
                index++;
                name = field + '_' + index;
            }
            result[name] = object[field];
        }
        return '';
    }
}


module.exports = {
    beginFields:        beginFields,
    endFields:          endFields,
    property:           property
}
