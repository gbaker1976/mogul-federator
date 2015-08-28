var net = require( 'net' );
var fs = require( 'fs' );
var server = net.createServer(function( conn ){
	var buffer = [];

	conn.on( 'close', function(){
		console.log( 'connection closed' );
	});

	conn.on( 'data', function( data ){
		buffer.push( data );
	});

	conn.on( 'end', function(){
		handleSocketData( buffer, conn );
	});
});


// client for handshake/registration
var client = net.connect({ port: 8124 }, function( conn ){
	console.log( 'connected to federator' );

	fs.createReadStream( './api.json', { encoding: 'utf8' } ).pipe( client );
});

client.on( 'data', function( data ){
	if ( 'ACK' === data.toString() ) {
		console.log( 'registration acknowledged' );
		console.log( 'ending connection' );
		client.end();
	}
});

client.on( 'end', function(){
	console.log( 'connection to federator ended' );
});


server.listen( 8125, function(){
	console.log( 'API node listening on port 8124...' );
});


function handleSocketData( buf, conn ){
	console.log( buf.join('') );
}
