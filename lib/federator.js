var net = require( 'net' );
var httpProxy = require( 'http-proxy' );

module.exports = function( server ){
	var registry = {};
	var proxy = httpProxy.createProxyServer({});
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
		var service = registry[ req.path() ];

		if ( service ) {
			var target = service.https ? 'https' : 'http' + '://' + service.host + ':' + service.port;
			proxy.web( req, res, { target: target }, function( err ){
				if ( err ) {
					res.send( 500, err );
					res.end();
				}
			});
			return next();
		} else {
			res.send( 404 );
			res.end();
		}
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
