module.exports = function( req, res, next ){

	if ( hasCsrf( req ) && bearerIsValid( req ) ) {
		return next();
	}

	res.send( 401, 'unauthorized' );
	res.end();
};

function bearerIsValid( req ){
	return req.authorization &&
		'Bearer' === req.authorization.scheme &&
			'foo' === req.authorization.credentials;
}

function hasCsrf( req ){
	return 'csrf' === (req.headers && req.headers[ 'x-mogul-csrf' ]);
}
