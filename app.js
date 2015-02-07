var http = require('http'),
    httpProxy = require('http-proxy'),
    express = require('express');

//
// Create a proxy server with latency
//
var proxy = httpProxy.createProxyServer();

//
// Create your server that makes an operation that waits a while
// and then proxies the request
//
http.createServer(function (req, res) {
  proxy.web(req, res, {
      target: 'http://localhost:9008'
    });

  // This simulates an operation that takes 500ms to execute

  /*setTimeout(function () {
    proxy.web(req, res, {
      target: 'http://localhost:9008'
    });
  }, 2000);*/
}).listen(8008);

proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {  
  // entradas
  var currentIp = req.connection.remoteAddress;
  console.log(req.method + ' ' + req.url + ' ' + currentIp + ' ' + new Date() + (req.headers['x-forwarded-for'] == null ? '' : ' reversed from ' + req.headers['x-forwarded-for']) )
  //console.log(proxyReq.method)
  //console.log(req.headers);

  currentIp = '127.73.0.10';
  IsInRange('129.73.0.0', '129.73.255.255', currentIp);
});

proxy.on('proxyRes', function(proxyRes, req, res) {
  // salidas
  // remember: set content type
  console.log(req.method + ' ' + req.url + ' '  +  proxyRes.statusCode + ' ' + new Date() )
  
  /*
  if(req.url == '/')
    proxyRes.statusCode = 404;
  */
});


//
// Create your target server
//
var app = express();
var server = http.createServer(app);

require('./routes')(app);

server.listen(9008, 'localhost', function () {
  console.log('Express server listening on %d', 
    9008);
});

// Expose app
exports = module.exports = app;

/*
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('test web site');
  res.end();
}).listen(9008);
*/

IsInRange = function(start, end, current){
  var strt = start.split('.').map(function(val){ return val ; });

  var nd = end.split('.').map(function(val){ return val ; });

  var crrnt = current.split('.').map(function(val){ return val ; });

  var currentDecimal = decimalIp(crrnt);
  var startDecimal = decimalIp(strt);
  var endDecimal = decimalIp(nd);
  /*console.log(strt)
  console.log(nd)
  console.log(crrnt)

  console.log(startDecimal)
  console.log(endDecimal)
  console.log(currentDecimal)*/

  if(startDecimal <= currentDecimal && currentDecimal <= endDecimal )
    console.log(true);
}

decimalIp = function(ip_array){
  return (ip_array[0] * (256*256*256)) + (ip_array[1] * (256*256)) + (ip_array[2] * (256)) + ip_array[3];
}