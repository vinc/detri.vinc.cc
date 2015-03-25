#!/bin/env node

var fs = require('fs');
var path = require('path');
var Detri = require('../lib/detri');

var filename = path.resolve(__dirname, '../ephemeris.json');
var ephemeris = JSON.parse(fs.readFileSync(filename, 'utf8'))
var lat = parseFloat(process.argv[2], 10);
var lon = parseFloat(process.argv[3], 10);
var now = +new Date(process.argv[4] || new Date());

console.log('' + new Detri(ephemeris, now, lat, lon));
