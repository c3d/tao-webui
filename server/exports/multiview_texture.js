// ****************************************************************************
//  multiview_texture.js                                          Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given multiview texture name
//
//
//
//
//
//
//
//
// ****************************************************************************
//  (C) 2014 Christophe de Dinechin <christophe@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

var util = require('../util');

function emitMultiviewTexture(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the multiview texture
// ----------------------------------------------------------------------------
{
    var parms = value;
    if (parms && parms.label)
    {
        // Try to find it by label if the label is set
        var label = parms.label;
        var labels = page.properties._labels_;
        for (lbl in labels)
            if (labels[lbl] == label)
                console.log("Property will be ", page.properties[lbl], " for ", label, " as ", lbl);
    }

    var text = util.property(page, id, value);
    if (text === null)
        return '';
    return util.emitText(text);
}


module.exports = emitMultiviewTexture;
