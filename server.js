var fs = require('fs');
var path = require('path');
var express = require('express');
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

app.get('/', function(req, res) {
  var lat = parseFloat(req.query.lat, 10) || 0;
  var lon = parseFloat(req.query.lon, 10) || 0;
  var now = +new Date(req.query.now || new Date());

  switch (req.query.format) {
  case "txt":
    res.send('' + new Detri(ephemeris, now, lat, lon));
    break;
  case "html":
  default:
    read('index.html', function(data) {
      res.send(data)
    });
    break;
  }
});

app.get('/lib/detri.js', function(req, res) {
  read('.' + req.url, function(data) {
    res.send(data);
  });
});

app.get('/ephemeris.json', function(req, res) {
  read('.' + req.url, function(data) {
    res.send(data);
  });
});

//app.use(express.static(__dirname + '/public'));

var server = app.listen(1337, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Detri app listening at http://%s:%s', host, port);
});
