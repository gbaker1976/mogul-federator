var net = require( 'net' );
var os = require( 'os' );
var child_process = require( 'child_process' );

/*
 * module: federator
 *
 * description:
 * Controls API node registration and proxying of calls to registered API routes.
 */

module.exports = function( config, server, proxy ){
  var that = this;
  var child = child_process.fork( 'poller.js' );

	child.on( 'message', function( m ){
		if ( 'message' === m.type ) {
			processMessages( m.messages, server, proxy );
		}
	});

	child.on( 'error', function( err ){
		console.error( "Poller error:\n%s", err );
	});

  child.send({
		type: 'rax',
		config: config,
		queue: 'API-Reg'
	});

	return this;
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

	if ( !reg || !server || !proxy ) {
		return;
	}

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

function processMessages( payload, server, proxy ) {
	if ( !payload ) {
		console.log( "\nno messages\n" );
		return;
	}

	console.log( "\nProcessing messages...\n" );
	payload.messages.forEach(function( message ){
		handleRegistration( message.body, server, proxy );
	});
}
