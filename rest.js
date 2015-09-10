var restify = require( 'restify' );
var gatekeeper = require( './lib/gatekeeper' );
var config = require( 'config' );
var federator = require( './lib/federator' );
var httpProxy = require( 'http-proxy' );
var proxy = httpProxy.createProxyServer({});

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
  if ( federator( config, server, proxy ) ) {
    console.log( "Federator API node registration enabled. Subscribing to API node registration queue." );
  }
} else {
  console.log( "Federator API node registration disabled." );
}

server.use( restify.authorizationParser() );
server.use( restify.acceptParser( server.acceptable ) );
server.use( gatekeeper );
server.use( restify.gzipResponse() );

server.listen( config.port, function () {
  console.log( '%s listening at %s', server.name, server.url );
});
