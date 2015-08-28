module.exports = function( server, routerConfig ){
	var i = 0;
	var l = routerConfig.routers.length;
	var router = null;

	for(; i < l; i++ ){
		router = require( './' + routerConfig.routers[ i ].name );
		if ( router ) {
			router.register( server );
		}
	}

	return function( req, res, next ){
		next(); //noop
	}
};
