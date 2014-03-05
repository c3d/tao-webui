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

function emitPicture(picture, indent)
// ----------------------------------------------------------------------------
//   Emit for a single picture
// ----------------------------------------------------------------------------
{
    var ddd = '';
    // Get correct picture url (ignore id)
    var pic = util.JSONitem(picture, 'picture');
    if (pic)
    {
        // Parse and get picture settings by ignoring id behind
        // property name (for instance, {picx_1:30} returns 30).
        var picx = util.JSONitem(picture, 'picx');
        var picy = util.JSONitem(picture, 'picy');
        var picscale = util.JSONitem(picture, 'picscale');
        ddd = indent + 'picture' + '\n'
            + indent + '    color "white"\n'
            + indent + '    image ' + picx + ', ' + picy + ', '
            + picscale + '%, ' + picscale + '%, "'
            + util.escape(pic) + '"\n';
    }
    return ddd;
}


function emitPictures(page, indent)
// ----------------------------------------------------------------------------
//   Emit for all pictures in page
// ----------------------------------------------------------------------------
{
    var ddd = '';

    // Emit code for all pictures
    var pictures = util.filterJSON(page, '^picture');
    pictures.forEach(function(picture) {
        ddd += emitPicture(picture, indent);
    });
    return ddd;
}


module.exports = emitPictures;
