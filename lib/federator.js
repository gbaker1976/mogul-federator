var net = require( 'net' );

module.exports = function( server ){
	var socket = net.createServer(function( conn ){
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

	socket.listen( 8124, function(){
		console.log( 'Federator listening on port 8124...' );
	});
};

function handleSocketData( buf, conn ){
	console.log( buf.join('') );
}
