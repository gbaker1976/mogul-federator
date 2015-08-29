var gk = require( '../lib/gatekeeper' );
module.exports = {
  testGatekeeperBadToken: function( test ){
    var req = {
      authorization: {
        scheme: 'Bearer',
        credentials: 'foobar'
      },
      headers: {
        'x-mogul-csrf': 'csrf'
      }
    };
    var res = {
      send: function( code, message ){
        test.expect( 1 );
        test.ok( 401 === code );
        test.done();
      },
      end: function(){}
    };
    gk( req, res, function(){
      test.expect( 1 );
      test.ok( false );
      test.done();
    });
  },

  testGatekeeperGoodToken: function( test ){
    var req = {
      authorization: {
        scheme: 'Bearer',
        credentials: 'foo'
      },
      headers: {
        'x-mogul-csrf': 'csrf'
      }
    };
    var res = {
      send: function( code, message ){
        test.expect( 1 );
        test.ok( false );
        test.done();
      },
      end: function(){}
    };
    gk( req, res, function(){
      test.expect( 1 );
      test.ok( true );
      test.done();
    });
  }
};
