/*
 * module: whitelist
 *
 * description:
 * Retreives IP whitelist and provides methods to validate IP addresses.
 */

module.exports = function(){
	var list = [ "::ffff:127.0.0.1" ];

	return {
		check: function( ip ){
			return list.indexOf( ip ) > -1;
		}
	};
};
