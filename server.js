//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var fs = require('fs');

var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});


function go() 
{
  
  readFromFile("")
  
  function writeToByteArray()
  {
    var buffer = new Buffer(100);
    buffer.write('j', 0, 1, "utf8");
    buffer.writeInt32BE(12, 1);
    console.log(buffer.readInt32BE(1));
    console.log(buffer.toString("utf8", 0, 1));
  }
  
  function readFromFile(filePath)
  {
    console.log(process.cwd())
    var input = fs.createReadStream('text.txt')
    readLines(input)
  }
  
  function readLines(input) {
    var remaining = "";
    input.on('data', function(data) {
      remaining += data;
      var array = remaining.split("/[\s,]+/");
      array.forEach(function(token) {
        console.log(token);
        
      })
      
    })
    
    input.on('end', function() {
      console.log("\nfinished reading")
      
    })
    
  }
  
  
  
  
  
}

go();
