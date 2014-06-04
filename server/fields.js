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
//   If it has a single field, value can define the content of that field,
//   otherwise it defines the content of each field
{
    return function (page, id, value)
    {
        // Clone the reference object so that we don't change it
        var obj = JSON.parse(JSON.stringify(object));
        var label = null;

        // Check if we have a single entry in the reference object.
        // If so, value may be a shortcut for that value
        // Turn something like { label: "Hello", min: 5, max: 3 }
        // into something like { label: "Hello", real: { min: 5, max: 3 } }
        // If value contains 'init', we'll use that directly
        if (value !== undefined)
        {
            // Check if the reference object contains a single entry,
            // e.g. 'real' or 'texture', defined as real: 30,
            // This excludes e.g. 'page', which has multiple fields.
            var keys = Object.keys(obj);
            if (keys.length == 1)
            {
                // Get id for that object, e.g. 'texture' or 'real',
                // If value does not define it, then it may define its fields
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
                    else if (Object.keys(value).length > 0)
                    {
                        wrapped[id] = value
                        obj = wrapped;
                    }
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


function body(object)
// ----------------------------------------------------------------------------
//   A body refers to a recursive .DDT model
// ----------------------------------------------------------------------------
{
    return function (page, id, value)
    {
        var name = value.label;
        if (!result.bodies)
            result.bodies = name;
        else
            result.bodies += ' ' + name;
        return '';
    }
}


module.exports = {
    beginFields:        beginFields,
    endFields:          endFields,
    property:           property,
    body:               body
}
