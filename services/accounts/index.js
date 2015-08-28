var service = require( './account-service' );

module.exports = {
	register: function( app ){

		// CRUD accounts collection
		app.get( '/accounts', function (req, res, next) {
			service.getAll(function( code, result ){
				res.send( code, result );
				next();
			});
		});

		app.post( '/accounts', function (req, res, next) {
			service.add( req.body, function( code, result ){
				res.send( code, result );
				next();
			});
		});

		// CRUD accounts resource
		app.get( '/accounts/:id', function (req, res, next) {
			service.getById( req.params.id, function( code, result ){
				res.send( code, result );
				next();
			});
		});

		app.put( '/accounts/:id', function (req, res, next) {
			service.updateById( req.params.id, req.body, function( code, result ){
				res.send( code, result );
				next();
			});
		});

		app.del( '/accounts/:id', function (req, res, next) {
			service.deleteById( req.params.id, function( code, result ){
				res.send( code, result );
				next();
			});
		});
	}
};
