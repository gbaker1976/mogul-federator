var net = require( 'net' );
var httpProxy = require( 'http-proxy' );
var os = require( 'os' );

/*
 * module: federator
 *
 * description:
 * Controls API node registration and proxying of calls to registered API routes.
 */

module.exports = function( config ){
	this.initRegistrationServer = function( server ){
		var addr = getAddress( config.address.interface, config.address.family );
		var port = config.port || (console.error( 'You must supply a port.' ));
		var proxy = httpProxy.createProxyServer({});
		var socket;

		if ( !addr ) {
			console.log( "\n***Aborting. Unable to secure address***\n" );
			return false;
		}

		socket = net.createServer(function( conn ){
			var buffer = [];

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

		socket.listen( port, addr, function(){
			console.log( "Federator listening on host %s on port %s...", addr, port );
		});

		return true;
	};

	return this;
};

/*
 * function: getAddress
 *
 * description:
 * Gets the address of the provided family from the provided interface.
 *
 * params:
 * - interface The network interface to use when finding the IP address.
 * - family The address family to find.
 */
 function getAddress( interface, family ) {
	 var addr;

	 if ( !interface ) {
		 console.error( 'You must supply a network interface.' );
	 }

	 if ( !family ) {
		 console.error( 'You must supply a network family.' );
	 }

	 var iface = os.networkInterfaces()[ interface ];

	 if ( iface ) {
		 iface.some(function( a ){
			 if ( family === a.family ) {
				 addr = a.address;
				 return true;
			 }
		 });
	 }

	 return addr;
 }

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
