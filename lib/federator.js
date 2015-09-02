var net = require( 'net' );
var httpProxy = require( 'http-proxy' );
var whitelist = require( './whitelist' )();

module.exports = function( server ){
	var proxy = httpProxy.createProxyServer({});
	var socket = net.createServer(function( conn ){
		var buffer = [];

		if ( !whitelist.check( conn.remoteAddress ) ) {
			console.log( conn.remoteAddress + ' NODE REJECTED' );
			conn.destroy(); // kill connection
		}

		conn.on( 'close', function(){
			console.log( 'connection closed' );
		});

		conn.on( 'data', function( data ){
			if ( handleRegistration( data.toString(), server, proxy ) ) {
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

	return this;
};

function handleRegistration( reg, server, proxy ){
	var route;

	reg = JSON.parse( reg );

	for ( route in reg.routes ) {
		if ( reg.routes.hasOwnProperty( route ) ) {
			registerMethods( route, reg.routes[ route ], reg, server, proxy );
		}
	}

	return true;
}

function registerMethods( route, methods, reg, server, proxy ){
	methods.forEach(function( method ){
		method = method.toLowerCase();

		if ( 'delete' === method ) {
			method = 'del';
		}

		server[ method ]( route, function( req, res, next ){
			var target = reg.server.https ? 'https' : 'http' + '://' + reg.server.host + ':' + reg.server.port;
			proxy.web( req, res, { target: target }, function( err ){
				if ( err ) {
					res.send( 500, err );
					res.end();
				}
			});
		});
	});
}
