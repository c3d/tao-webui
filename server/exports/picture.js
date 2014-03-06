// ****************************************************************************
//  picture.js                                                     Tao project
// ****************************************************************************
//
//   File Description:
//
//     Emit the code for a single picture and a collection of pictures
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

function emitPicture(page, indent, id)
// ----------------------------------------------------------------------------
//   Emit for a single picture
// ----------------------------------------------------------------------------
{
    var ddd = '';

    if (id)
    {
        var picture = page.properties[id];
        if (picture)
        {
            // Get correct picture url (ignore id)
            var pic = util.item(picture, 'url');
            if (pic)
            {
                // Parse and get picture settings by ignoring id behind
                // property name (for instance, {x_1:30} returns 30).
                var picx = util.item(picture, 'x');
                var picy = util.item(picture, 'y');
                var picscale = util.item(picture, 'scale');
                ddd = indent + 'picture' + '\n'
                    + indent + '    color "white"\n'
                    + indent + '    image ' + picx + ', ' + picy + ', '
                    + picscale + '%, ' + picscale + '%, "'
                    + util.escape(pic) + '"\n';
            }
        }
    }
    return ddd;
}


module.exports = emitPicture;
