var couchbase = require( 'couchbase' );
var uuid = require( 'node-uuid' );
var _ = require( 'underscore' );
var db = new couchbase.Connection({ host: 'localhost:8091', bucket: 'default' });

module.exports = {
	register: function( app ){

		// CRUD accounts collection
		app.get( '/accounts', function (req, res, next) {
			var query = db.view( 'accounts', 'all_accounts' );
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

		app.post( '/accounts', function (req, res, next) {
			var account = _.extend( 
				{}, 
				req.body, 
				{
					account_id: uuid.v1(),
					type: 'account'
				}
			);

			if ( !account.username || !account.password ) {
				res.send( 409, 'Username and password must be supplied' );
				return;
			}

			db.set( account.account_id, account, function( err, result ){
				if (err) {
        			res.send( 500, err );
        			return;
        		}

        		db.get( account.account_id, function( err, result ){
        			if (err) {
	        			res.send( 500, err );
	        			return;
	        		}

	        		res.send( 201, result[0] );
       				return next();
        		});
			});
		});

		// CRUD accounts resource
		app.get( '/accounts/:id', function (req, res, next) {
			var query = db.view( 'accounts', 'by_accountid' );
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

		app.put( '/accounts/:id', function (req, res, next) {
			var accountId = null;

			if ( !req.body || !req.body.username || !req.body.password ) {
				res.send( 409, 'Username and password must be supplied' );
				return;
			}

			accountId = req.body.account_id = req.params.id;

			db.set( accountId, req.body, function( err, result ){
				if (err) {
        			res.send( 500, err );
        			return;
        		}

        		db.get( accountId, function( err, result ){
        			if (err) {
	        			res.send( 500, err );
	        			return;
	        		}

	        		res.send( 200, result[0] );
       				return next();
        		});
			});
		});

		app.del( '/accounts/:id', function (req, res, next) {
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