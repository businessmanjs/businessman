var express = require( 'express' )
var app = express()
var port = 9000

app.get( '/*', function( req, res ) {
    var pathname = req.path
    console.log( 'get', pathname )
    if ( pathname.match( /.*\.js/ ) ) res.sendFile( __dirname + pathname )
} )

app.listen( port )

console.log( 'Server running at http://localhost:' + port )
