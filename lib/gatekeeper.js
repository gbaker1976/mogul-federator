var uuid = require( 'node-uuid' );
var Module = function(){

	this.initialize = function( api, server ){
		this.server = server;
		this.api = api;
	};

	this.handleAuth = function( req, res, next ){
		if ( 
				!req.authorization || 
				req.authorization.scheme !== 'Bearer' || 
				req.authorization.credentials !== 'foo' 
			) {
				res.send( 401, 'unauthorized' );
				res.end();
		}
		return next();
	};

	this.handlers = function( handler ){
		if ( !handler ) return;

		var handlers = [
			this.handleAuth,
			this.api.queryParser(),
			this.api.bodyParser()
		];

		handlers.push( handler );

		return handlers;
	};

	this.newId = function(){
		return uuid.v1();
	};

	this.get = function( route, handler ){
		this.server.get( route, this.handlers( handler ) );
	};
	
	this.put = function( route, handler ){
		this.server.put( route, this.handlers( handler ) );
	};

	this.post = function( route, handler ){
		this.server.post( route, this.handlers( handler ) );
	};

	this.del = function( route, handler ){
		this.server.del( route, this.handlers( handler ) );
	};
};

module.exports = new Module();