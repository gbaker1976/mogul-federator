var couchbase = require( 'couchbase' );
var uuid = require( 'node-uuid' );
var _ = require( 'underscore' );
var cluster = new couchbase.Cluster( '127.0.0.1:8091' ); // mock mode
var bucket = cluster.openBucket( 'default' ); // mock mode

module.exports = {
	register: function( app ){

		// CRUD accounts collection
		app.get( '/accounts', function (req, res, next) {

			var query = couchbase.ViewQuery.from( 'accounts', 'all_accounts' );

			bucket.query( query, function(err, result) {
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

			bucket.insert( account.account_id, account, function( err, result ){
				if (err) {
        			res.send( 500, err );
        			return;
        		}

        		bucket.get( account.account_id, function( err, result ){
        			if (err) {
	        			res.send( 500, err );
	        			return;
	        		}

	        		res.send( 201, result.value );
       				return next();
        		});
			});
		});

		// CRUD accounts resource
		app.get( '/accounts/:id', function (req, res, next) {

			bucket.get( req.params.id, function(err, result) {
	  		if (err) {
	  			res.send( 404, err );
	  			return;
	  		}

	  		res.send( result.value );
	 			return next();
			});
		});

		app.put( '/accounts/:id', function (req, res, next) {
			var accountId = null;

			if ( !req.body || !req.body.username || !req.body.password ) {
				res.send( 409, 'Username and password must be supplied' );
				return;
			}

			// prevent loss of account_id
			accountId = req.body.account_id = req.params.id;

			bucket.set( accountId, req.body, function( err, result ){
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
			bucket.remove( req.params.id, function( err, result ){
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
