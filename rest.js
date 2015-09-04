var restify = require( 'restify' );
var gatekeeper = require( './lib/gatekeeper' );
var config = require( 'config' );
var federator = require( './lib/federator' )( config );

var server = restify.createServer({
  name: 'Mogul',
  version: '1.0.0'
});

server.use( restify.throttle({
	burst: 100,
	rate: 50,
	ip: true,
	overrides: {
		'127.0.0.1': {
			rate: 0,  // unlimited
			burst: 0
		}
	}
}));

server.use( restify.CORS({
	origins: [
		'https://127.0.0.1'
	],
    credentials: true,
    headers: [
    	'x-mogul-csrf'
    ]
}));

if ( true === config.allowRegistration ) {
  if ( federator.initRegistrationServer( server ) ) {
    console.log( "Federator API node registration enabled. Listening for API node registration." );
  } else {
    console.log( "Federator API node registration enabled, but, API node registration server failed to start." );
    return;
  }
} else {
  console.log( "Federator API node registration disabled. Starting in API service proxy mode only." );
}

server.use( restify.authorizationParser() );
server.use( restify.acceptParser( server.acceptable ) );
server.use( gatekeeper );
server.use( restify.gzipResponse() );

server.listen( 10000, function () {
  console.log( '%s listening at %s', server.name, server.url );
});
