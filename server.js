var express = require('express');
var app = express();

app.use('/rest', express.static( __dirname + '/rest'));
app.use(express.static( __dirname + '/www'));

var PORT = process.env.PORT || 3000;
app.listen(PORT, null, function() {
    console.log('Server listening on port ' + PORT);
});
