module.exports = {
	register: function( app ){

		// CRUD assets collection
		app.get( '/publish', function (req, res, next) {
		  res.send('get publish records');
		  return next();
		});

		app.post( '/publish', function (req, res, next) {
			res.send('post to publish collection');
			return next();
		});

		// CRUD assets resource
		app.get( '/publish/:publishId', function (req, res, next) {
		  res.send( 'get ' + req.params.publishId );
		  return next();
		});

		app.put( '/publish/:publishId', function (req, res, next) {
		  res.send( 'put to ' + req.params.publishId );
		  return next();
		});

		app.del( '/publish/:publishId', function (req, res, next) {
		  res.send( 'delete ' + req.params.publishId );
		  return next();
		});

	}	
};