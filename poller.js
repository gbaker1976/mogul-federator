var rax = require( 'rax-api' );

process.on( 'message', function( m ) {
  var raxQ = rax( m.config ).queues;
  var pollFunc = function(){
    raxQ.getMessages( m.queue, function( err, messages ){
      if ( err ) {
        console.log( err );
        return;
      }

      process.send({
        type: 'message',
        messages: messages
      });

      setTimeout( pollFunc, 1000 );
    });
  };

  if ( 'rax' === m.type && m.queue && m.config ) {
    setTimeout( pollFunc, 1000 );
  }
});
