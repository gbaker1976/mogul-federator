var restify = require( 'restify' );
var router = require( './routers/index' );
var gatekeeper = require( './lib/gatekeeper' );

var server = restify.createServer({
  name: 'mogul',
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
    	'x-foo' 
    ]
}));

server.use( restify.acceptParser( server.acceptable ) );
server.use( restify.authorizationParser() );

gatekeeper.initialize( restify, server );
router.register( gatekeeper );

server.listen( 10000, function () {
  console.log( '%s listening at %s', server.name, server.url );
});