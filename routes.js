/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {

  // Insert routes below
  app.get('/', function(req,res){
    res.header("Content-Type", "text/html");
    res.send('hello!');
  });

  app.get('/hello', function(req,res){
    res.send('hello ...? Again');
  });

  app.get('/heartbeat', function(req,res){
    res.status(200);
    res.end();
  });
};
