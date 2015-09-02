module.exports = function(){
	var list = [ "127.0.0.1" ];

	return {
		check: function( ip ){
			return list.indexOf( ip ) > -1;
		}
	};
};
