var net = require( 'net' );

module.exports = function( server ){
	var registry = {};
	var socket = net.createServer(function( conn ){
		var buffer = [];

		conn.on( 'close', function(){
			console.log( 'connection closed' );
		});

		conn.on( 'data', function( data ){
			if ( handleRegistration( data.toString(), registry ) ) {
				conn.write( "ACK" );
			} else {
				conn.write( "ERR" );
			}
		});

		conn.on( 'end', function(){
			console.log('client disconnected');
		});
	});

	socket.listen( 8124, function(){
		console.log( 'Federator listening on port 8124...' );
	});

	this.federate = function( req, res, next ){
		console.log( 'Delegating to ' + registry[ req.path() ].host + ' for client request' );
		next();
	};

	return this;
};

function handleRegistration( reg, registry ){
	reg = JSON.parse( reg );

	reg.routes.forEach(function( route ){
		registry[ route ] = reg.server;
	});

	return true;
}
