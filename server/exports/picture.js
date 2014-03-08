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

function emitPicture(page, id, value)
// ----------------------------------------------------------------------------
//   Emit for a single picture
// ----------------------------------------------------------------------------
{
    var ddd = '';

    var picture = util.page_property(page, id, value);
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
            ddd = 'picture' + '\n'
                + '    color "white"\n'
                + '    image ' + picx + ', ' + picy + ', '
                + picscale + '%, ' + picscale + '%, "'
                + util.escape(pic) + '"\n';
        }
    }
    return ddd;
}


module.exports = emitPicture;
