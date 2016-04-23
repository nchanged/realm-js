var realm = require('./index.js');
var fs = require('fs');

var s = realm.transpiler.str(fs.readFileSync('./hello.js').toString());
console.log(s);
