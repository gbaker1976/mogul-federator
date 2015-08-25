module.exports = {
	register: function( app ){

		// CRUD sites collection
		app.get( '/sites', function (req, res, next) {
		  res.send('get sites' );
		  return next();
		});

		app.post( '/sites', function (req, res, next) {
		  res.send('post sites');
		  return next();
		});

		// CRUD sites resource
		app.get( '/sites/:id', function (req, res, next) {
		  res.send( 'get ' + req.params.id );
		  return next();
		});

		app.put( '/sites/:id', function (req, res, next) {
		  res.send( 'put to ' + req.params.id );
		  return next();
		});

		app.del( '/sites/:id', function (req, res, next) {
		  res.send( 'delete ' + req.params.id );
		  return next();
		});

	}	
};