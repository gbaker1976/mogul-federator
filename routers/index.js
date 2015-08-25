var routerFile = require( '../routers.json' );

module.exports = {
	register: function( server ){
		var i = 0;
		var l = routerFile.routers.length;
		var router = null;

		for(; i < l; i++ ){
			router = require( './' + routerFile.routers[ i ].name );
			if ( router ) {
				router.register( server );
			}
		}
	}
};