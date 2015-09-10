var rax = require( 'rax-api' );
var pollInterval = 10000;
var timeoutId;

process.on( 'message', function( m ) {
  var pollFunc;

  if ( 'rax' === m.type && m.queue && m.config ) {

    pollFunc = (function( raxQ, queue ){
      return function(){
        raxQ.getMessages( queue, function( err, messages ){
          if ( err ) {
            console.error( "Error from rackspace API:\n%s", err );
            return;
          }

          process.send({
            type: 'message',
            messages: messages
          });

          clearTimeout( timeoutId );
          timeoutId = setTimeout( pollFunc, pollInterval );
        });
      }
    })( rax( m.config ).queues, m.queue );

    clearTimeout( timeoutId );
    timeoutId = setTimeout( pollFunc, pollInterval );
  }
});
