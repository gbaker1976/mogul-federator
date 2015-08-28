var service = require( './account-service' );

module.exports = {
	register: function( app ){

		// CRUD accounts collection
		app.get( '/accounts', function (req, res, next) {
			service.getAll(function( result ){
				res.send( result.code, result.payload );
				next();
			});
		});

		app.post( '/accounts', function (req, res, next) {
			service.add( req.body, function( result ){
				res.send( result.code, result.payload );
				next();
			});
		});

		// CRUD accounts resource
		app.get( '/accounts/:id', function (req, res, next) {
			service.getById( req.params.id, function( result ){
				res.send( result.code, result.payload );
				next();
			});
		});

		app.put( '/accounts/:id', function (req, res, next) {
			service.updateById( req.params.id, req.body, function( result ){
				res.send( result.code, result.payload );
				next();
			});
		});

		app.del( '/accounts/:id', function (req, res, next) {
			service.deleteById( req.params.id, function( result ){
				res.send( result.code, result.payload );
				next();
			});
		});
	}
};
