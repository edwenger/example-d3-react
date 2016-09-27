var cuid = require('cuid');

var X_MIN = -500;
var X_MAX = 500;
var Y_MIN = -500;
var Y_MAX = 500;
var Z_MIN = 1;
var Z_MAX = 10;

var ns = {};

ns.generate = function(n) {
  var res = [];
  for (var i = 0; i < n; i++) {
   res.push(this.generateDatum({x: [X_MIN, X_MAX], y: [Y_MIN, Y_MAX]}));
  }
  return res;
};

ns.generateDatum = function(domain) {
  return {
    id: this._uid(),
    x: this._randomIntBetween(domain.x[0], domain.x[1]),
    y: this._randomIntBetween(domain.y[0], domain.y[1]),
    z: this._randomIntBetween(Z_MIN, Z_MAX),
  };
};

ns._randomIntBetween = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

ns._uid = function() {
  return cuid();
};

module.exports = ns;
