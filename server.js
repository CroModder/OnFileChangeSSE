var http = require('http');
var fs = require('fs');
 
function sendServerSendEvent(req, res) {
 res.writeHead(200, {
 'Content-Type' : 'text/event-stream',
 'Cache-Control' : 'no-cache',
 'Connection' : 'keep-alive'
 });
 
 
fs.watchFile(__dirname + '/data.json', function(curr, prev) {
    console.log('promjena');
    // on file change we can read the new xml
    fs.readFile(__dirname + '/data.json', function(err, data) {
      if (err) throw err;
      // send the new data to the client
      var sseId = (new Date()).toLocaleTimeString();
      podaci =
      writeServerSendEvent(res, sseId, JSON.parse(data));
    });
  });
}
 
function writeServerSendEvent(res, sseId, data) {
	res.write('retry: 300 \n');
	res.write('id: ' + sseId + '\n');
	res.write("data: " + JSON.stringify(data) + '\n\n');
}
 
http.createServer(function(req, res) {
 if (req.headers.accept && req.headers.accept == 'text/event-stream') {
 if (req.url == '/talk') {
 sendServerSendEvent(req, res);
 } else {
 res.writeHead(404);
 res.end();
 }
 } else {
 res.writeHead(200, {
 'Content-Type' : 'text/html'
 });
 res.write(fs.readFileSync(__dirname + '/index.html'));
 res.end();
 }
}).listen(8080);
