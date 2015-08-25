var couchbase = require( 'couchbase' );
var _ = require( 'underscore' );
var db = new couchbase.Connection({ host: 'localhost:8091', bucket: 'default' });

module.exports = {
	register: function( app ){

		// CRUD elements collection
		app.get( '/elements', function (req, res, next) {
			var query = db.view( 'elements', 'all_elements' );
			query.query( function(err, result) {
        		if (err) {
        			res.send( 500, err );
        			return;
        		}

        		if ( !result || !result.length ) {
        			res.send( 204 );
        			return;
        		}

        		res.send( result );
       			return next();
      		});
		});

		app.post( '/elements', function (req, res, next) {
			var element = _.extend( 
				{}, 
				req.body, 
				{
					element_id: app.newId(),
					type: 'element'
				}
			);

			db.set( element.element_id, element, function( err, result ){
				if (err) {
        			res.send( 500, err );
        			return;
        		}

        		db.get( element.element_id, function( err, result ){
        			if (err) {
	        			res.send( 500, err );
	        			return;
	        		}

	        		res.send( 201, result[0] );
       				return next();
        		});
			});
		});

		// CRUD elements resource
		app.get( '/elements/:id', function (req, res, next) {
			var query = db.view( 'elements', 'by_elementid' );
			query.query( { key: req.params.id }, function(err, result) {
        		if (err) {
        			res.send( 500, err );
        			return;
        		}

        		if ( !result || !result.length ) {
        			res.send( 404 );
        			return;
        		}

        		res.send( result[0] );
       			return next();
      		});
		});

		app.put( '/elements/:id', function (req, res, next) {
			var elementId = null;

			elementId = req.body.element_id = req.params.id;

			db.set( elementId, req.body, function( err, result ){
				if (err) {
        			res.send( 500, err );
        			return;
        		}

        		db.get( elementId, function( err, result ){
        			if (err) {
	        			res.send( 500, err );
	        			return;
	        		}

	        		res.send( 200, result[0] );
       				return next();
        		});
			});
		});

		app.del( '/elements/:id', function (req, res, next) {
			db.remove( req.params.id, function( err, result ){
		  		if (err) {
        			res.send( 500, err );
        			return;
        		}

        		res.send( 200, result );
       			return next();
			});
		});

	}	
};