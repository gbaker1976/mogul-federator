var net = require( 'net' );
var httpProxy = require( 'http-proxy' );
var whitelist = require( './whitelist' )();

/*
 * module: federator
 *
 * description:
 * Controls API node registration and proxying of calls to registered API routes.
 */

module.exports = function( server ){
	var proxy = httpProxy.createProxyServer({});
	var socket = net.createServer(function( conn ){
		var buffer = [];

		if ( !whitelist.check( conn.remoteAddress ) ) {
			reject( conn );
		}

		conn.on( 'close', function(){
			// log( 'CLOSE', conn, connId );
		});

		conn.on( 'data', function( data ){
			if ( handleRegistration( data.toString(), server, proxy ) ) {
				conn.write( "ACK" );
				// log( 'ACK', conn, connId );
			} else {
				conn.write( "ERR" );
				// log( 'ERR', conn, connId );
			}
		});

		conn.on( 'end', function(){
			// log( 'CLIENT_DISCONNECT', conn, connId );
		});
	});

	socket.listen( 8124, function(){
		console.log( 'Federator listening on port 8124...' );
	});

	return this;
};

/*
 * function: reject
 *
 * description:
 * destroys socket and logs rejection.
 *
 * params:
 * - socket The socket to reject.
 */
function reject( sock ){
	sock.destroy();
	console.log( "\nConnection rejected from %s\nReason: address not found in whitelist\n", sock.remoteAddress );
};

/*
 * function: handleRegistration
 *
 * description:
 * Processes the registration payload from the registering node.
 *
 * params:
 * - reg The registration payload.
 * - server The app server to which the registration is occurring.
 * - proxy The proxy server that will be used to forward registered calls.
 */
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

/*
 * function: registerMethods
 *
 * description:
 * Registers proxy methods from the registering API node with the app server.
 *
 * params:
 * - route The route URL being registered.
 * - methods The HTTP methods the route URL supports
 * - reg The complete registration payload from the registring API node.
 * - server The app server to which the registration is occurring.
 * - proxy The proxy server that will be used to forward registered calls.
 */
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
