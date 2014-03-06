// ****************************************************************************
//  movie.js                                                     Tao project
// ****************************************************************************
//
//   File Description:
//
//     Emit the code for a single movie and a collection of movies
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

function emitMovie(page, indent, id)
// ----------------------------------------------------------------------------
//   Emit code for a single movie
// ----------------------------------------------------------------------------
{
    var ddd = '';

    if (id)
    {
        var movie = page.properties[id];
        if (movie)
        {
            // Get correct movie url (ignore id)
            var mov = util.item(movie, 'url');
            if (mov)
            {
                util.importHeader(page.ctx, 'VLCAudioVideo');

                if (mov.indexOf('://') === -1)
                    mov = 'videos/' + mov;

                // Parse and get movie settings by ignoring id behind
                // property name (for instance, {movx_1:30} returns 30).
                var movx = util.item(movie, 'x');
                var movy = util.item(movie, 'y');
                var movscale = util.item(movie, 'scale');
                ddd = indent + 'picture' + '\n'
                    + indent + '    movie ' + movx + ', ' + movy + ', '
                    + movscale + '%, ' + movscale + '%, "'
                    + util.escape(mov) + '"\n';

                // Add drop command on page exit
                ddd +=  indent + '    on "pageexit",\n';
                ddd +=  indent + '        movie_drop "' + mov + '"\n';
            }
        }
    }
    return ddd;
}


module.exports = emitMovie;
