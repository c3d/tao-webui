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
//   Add a property to the properties of the object
// ----------------------------------------------------------------------------
//   The object can have multiple fields
//   If it has a single field, 'value' can define the content of that field,
//   otherwise it defines the content of each field
{
    return function (page, id, value)
    {
        var label = null;
        var obj = JSON.parse(JSON.stringify(object));

        // Check if we have a single entry in the input object.
        // If so, value may be a shortcut for that value
        // Turn something like { label: "Hello", min: 5, max: 3 }
        // into something like { label: "Hello", real: { min: 5, max: 3 } }
        if (value !== undefined)
        {
            var keys = Object.keys(obj);
            if (keys.length == 1)
            {
                var id = keys[0];
                if (value[id] === undefined)
                {
                    var label = value.label;
                    var wrapped = { };
                    if (label !== undefined)
                    {
                        wrapped.label = label;
                        delete value.label;
                    }
                    if (value.init !== undefined)
                    {
                        value[id] = value.init;
                        delete value.init;
                    }
                    wrapped[id] = value
                    obj = wrapped;
                    console.log("Wrapped=", wrapped);
                }
            }
        }

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
            while (result.hasOwnProperty(name))
            {
                index++;
                name = field + '_' + index;
            }

            // If label is set, update labels
            if (label)
            {
                if (!result._labels_)
                    result._labels_ = { }
                result._labels_[name] = label;
                label = null;
            }

            result[name] = obj[field];
        }

        return '';
    }
}


module.exports = {
    beginFields:        beginFields,
    endFields:          endFields,
    property:           property
}
