/*
 * module: gatekeeper
 *
 * description:
 * Middleware that handles incoming authorization and csrf.
 */

module.exports = function( req, res, next ){

	if ( hasCsrf( req ) && bearerIsValid( req ) ) {
		return next();
	}

	res.send( 401, 'unauthorized' );
	res.end();
};

/*
 * function: bearerIsValid
 *
 * description:
 * Validates a client-provided bearer token.
 *
 * requires:
 * - Restify authorization middleware.
 *
 * params:
 * - req The client request.
 */
function bearerIsValid( req ){
	return req.authorization &&
		'Bearer' === req.authorization.scheme &&
			'foo' === req.authorization.credentials;
}

/*
 * function: hasCsrf
 *
 * description:
 * Validates a client-provided CSRF header.
 *
 * params:
 * - req The client request.
 */
function hasCsrf( req ){
	return 'csrf' === (req.headers && req.headers[ 'x-mogul-csrf' ]);
}
