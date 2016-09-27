var TransmissionNode = require('./TransmissionNode');

var X_MIN = 0;
var X_MAX = 100;
var Y_MIN = 0;
var Y_MAX = 100;
var Z_MIN = 1;
var Z_MAX = 30;

var ns = {};

ns.generate = function(n) {
  var res = [];
  for (var i = 0; i < n; i++) {
   res.push(this.generateDatum({x: [X_MIN, X_MAX], y: [Y_MIN, Y_MAX]}));
  }
  return res;
};

ns.generateDatum = function(domain) {
  return new TransmissionNode(
      x=this._randomIntBetween(domain.x[0], domain.x[1]),
      y=this._randomIntBetween(domain.y[0], domain.y[1]),
      weight=this._randomIntBetween(Z_MIN, Z_MAX),
      receptivity=this._randomFloatBetween(0, 1),
      infectiousness=0
  );
};

ns._randomIntBetween = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

ns._randomFloatBetween = function(min, max) {
  return Math.random() * (max - min) + min;
};

module.exports = ns;
