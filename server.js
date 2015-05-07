var fs = require('fs');
var path = require('path');
var express = require('express');
var port = process.env.PORT || 3000;
var app = express();

var Detri = require('./lib/detri');

var filename = path.resolve(__dirname, './ephemeris.json');
var ephemeris = JSON.parse(fs.readFileSync(filename, 'utf8'))

var read = function(filename, callback) {
  var pathname = path.resolve(__dirname, filename);

  fs.readFile(pathname, 'utf8', function(err, data) {
    callback(data); 
  });
};

app.use(express.static(__dirname + '/public'));

var server = app.listen(port, function() {
  console.log('server listening at port %d', port);
});
