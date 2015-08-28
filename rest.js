var restify = require( 'restify' );
var router = require( './services' );
var gatekeeper = require( './lib/gatekeeper' );
var federator = require( './lib/federator' );
var routerConfig = require( './routers.json' );

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

federator( server );

server.use( restify.authorizationParser() );
server.use( gatekeeper );
server.use( restify.acceptParser( server.acceptable ) );
server.use( restify.queryParser() );
server.use( restify.bodyParser() );
server.use( router( server, routerConfig ) );
server.use( restify.gzipResponse() );

server.listen( 10000, function () {
  console.log( '%s listening at %s', server.name, server.url );
});
