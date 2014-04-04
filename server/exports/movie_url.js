// ****************************************************************************
//  movie_url.js                                                    Tao project
// ****************************************************************************
//
//   File Description:
//
//     Return the given movie URL
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

function emitMovieURL(page, id, value)
// ----------------------------------------------------------------------------
//   Emit the name of the movie URL
// ----------------------------------------------------------------------------
{
    var text = util.property(page, id, value);
    if (text === null)
        return '';
    return util.emitText(text);
}


module.exports = emitMovieURL;
