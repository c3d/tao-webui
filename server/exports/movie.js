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

function emitMovie(movie, indent)
// ----------------------------------------------------------------------------
//   Emit for a single movie
// ----------------------------------------------------------------------------
{
    var ddd = '';
    // Get correct movie url (ignore id)
    var mov = util.JSONitem(movie, 'movie');
    if (mov)
    {
        if (mov.indexOf('://') === -1)
            mov = 'videos/' + mov;

        // Parse and get movie settings by ignoring id behind
        // property name (for instance, {movx_1:30} returns 30).
        var movx = util.JSONitem(movie, 'moviex');
        var movy = util.JSONitem(movie, 'moviey');
        var movscale = util.JSONitem(movie, 'moviescalepercent');
        ddd = indent + 'picture' + '\n'
            + indent + '    movie ' + movx + ', ' + movy + ', '
            + movscale + '%, ' + movscale + '%, "'
            + util.escape(mov) + '"\n';

        // Add drop command on page exit
        ddd +=  indent + '    on "pageexit",\n';
        ddd +=  indent + '        movie_drop "' + mov + '"\n';
    }
    return ddd;
}


function emitMovies(page, indent)
// ----------------------------------------------------------------------------
//   Emit for all movies in page
// ----------------------------------------------------------------------------
{
    var ddd = '';

    // Emit code for all movies
    var movies = util.filterJSON(page, '^movie');
    movies.forEach(function(movie) {
        ddd += emitMovie(movie, indent);
    });
    return ddd;
}


module.exports = emitMovies;
