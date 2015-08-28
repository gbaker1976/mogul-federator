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
      callback( 500, err );
    }

    if ( !result || !result.length ) {
      callback( 204 );
    }

    callback( 200, result );
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
    callback( 409, 'Username and password must be supplied' );
  }

  bucket.insert( account.account_id, account, function( err, result ){
    if (err) {
      callback( 500, err );
    }

    bucket.get( account.account_id, function( err, result ){
      if (err) {
        callback( 500, err );
      }

      callback( 201, result.value );
    });
  });
};

Module.prototype.getById = function( id, callback ){
  bucket.get( id, function(err, result) {
    if (err) {
      callback( 404, err );
    }

    callback( 200, result.value );
  });
};

Module.prototype.updateById = function( id, props, callback ){
  var accountId = null;

  if ( !props || !props.username || !props.password ) {
    callback( 409, 'Username and password must be supplied' );
  }

  // prevent loss of account_id
  accountId = props.account_id = id;

  bucket.set( accountId, props, function( err, result ){
    if (err) {
      callback( 500, err );
    }

    bucket.get( accountId, function( err, result ){
      if (err) {
        callback( 500, err );
      }

      callback( 200, result );
    });
  });
};

Module.prototype.deleteById = function( id ){
  bucket.remove( id, function( err, result ){
    if (err) {
        callback( 500, err );
      }

      callback( 200, result );
  });
};

module.exports = new Module();
