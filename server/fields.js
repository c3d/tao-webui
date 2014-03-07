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
    return function(page, indent, id, value) {

        var label = null;
        var obj = object;
        if (value)
        {
            for (field in value)
            {
                if (field == 'label')
                    label = value[field];
                else
                    obj[field] = value[field];
            }
        }

        // Populate the 'result' object with fields, creating unique ones
        for (field in object)
        {
            var index = 0;
            var name = field;
            while (obj.hasOwnProperty(name))
            {
                index++;
                name = field + '_' + index;
            }
            result[name] = obj[field];
        }

        // If label is set, update labels
        if (label)
        {
            if (!result._labels_)
                result._labels_ = { }
            result._labels_[name] = label;
        }

        return '';
    }
}


module.exports = {
    beginFields:        beginFields,
    endFields:          endFields,
    property:           property
}
