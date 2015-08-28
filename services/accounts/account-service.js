var couchbase = require( 'couchbase' );
var uuid = require( 'node-uuid' );
var _ = require( 'underscore' );
var cluster = new couchbase.Cluster( '127.0.0.1:8091' ); // mock mode
var bucket = cluster.openBucket( 'default' ); // mock mode

var Module = function(){};

Module.prototype.getAll = function( callback ){
  var query = couchbase.ViewQuery.from( 'accounts', 'all_accounts' );

  bucket.query( query, function(err, result) {
    if (err) {
      callback( { code: 500, payload: err } );
    }

    if ( !result || !result.length ) {
      callback( { code: 204 } );
    }

    callback( { code: 200, payload: result } );
  });
};

Module.prototype.add = function( obj, callback ){
  var account = _.extend(
    {},
    obj,
    {
      account_id: uuid.v1(),
      type: 'account'
    }
  );

  if ( !account.username || !account.password ) {
    callback({
      code: 409,
      payload: 'Username and password must be supplied'
    });
  }

  bucket.insert( account.account_id, account, function( err, result ){
    if (err) {
      callback( { code: 500, payload: err} );
    }

    bucket.get( account.account_id, function( err, result ){
      if (err) {
        callback( { code: 500, payload: err} );
      }

      callback({
        code: 201,
        payload: result.value
      });
    });
  });
};

Module.prototype.getById = function( id, callback ){
  bucket.get( id, function(err, result) {
    if (err) {
      callback( { code: 404, payload: err } );
    }

    callback( { code: 200, payload: result.value } );
  });
};

Module.prototype.updateById = function( id, props, callback ){
  var accountId = null;

  if ( !props || !props.username || !props.password ) {
    callback( { code: 409, payload: 'Username and password must be supplied' } );
  }

  // prevent loss of account_id
  accountId = props.account_id = id;

  bucket.set( accountId, props, function( err, result ){
    if (err) {
      callback( { code: 500, payload: err } );
    }

    bucket.get( accountId, function( err, result ){
      if (err) {
        callback( { code: 500, payload: err } );
      }

      callback( { code: 200, payload: result } );
    });
  });
};

Module.prototype.deleteById = function( id ){
  bucket.remove( id, function( err, result ){
    if (err) {
        callback( { code: 500, payload: err } );
      }

      callback( { code: 200, payload: result } );
  });
};

module.exports = new Module();
