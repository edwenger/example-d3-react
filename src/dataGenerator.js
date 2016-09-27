var cuid = require('cuid');
var Combinatorics = require('js-combinatorics');
var sigma = require('./build/sigma.require.js');
var TransmissionNode = require('./TransmissionNode');

sigma.classes.graph.addMethod('neighbors', function(nodeId) {
    var k,
        neighbors = {},
        index = this.allNeighborsIndex[nodeId] || {};

    for (k in index) {
        neighbors[k] = this.nodesIndex[k];
    }
    return neighbors;
});

var X_MIN = -100;
var X_MAX = 100;
var Y_MIN = -100;
var Y_MAX = 100;
var Z_MIN = 1;
var Z_MAX = 30;

var ns = {};

ns.generate = function(n) {
  var s = new sigma();
  for (var i = 0; i < n; i++) {
   s.graph.addNode(this.generateDatum({x: [X_MIN, X_MAX], y: [Y_MIN, Y_MAX]}));
  }
  return s;
};

ns.generate_households = function(n_houses, mean_size) {
  var s = new sigma(),
          ind,
          theta,
          disp,
          dx,
          dy;

  for (var h = 0; h < n_houses; h++) {
    var house_location = {
      x: this._randomIntBetween(X_MIN, X_MAX),
      y: this._randomIntBetween(Y_MIN, Y_MAX)
    };
    var ind_ids = [];
    var n_inds = this._randomIntBetween(0.5 * mean_size, 1.5 * mean_size);
    for (var i = 0; i < n_inds; i++) {
      theta = 2.0 * i * Math.PI / n_inds;
      disp = Math.sqrt(n_inds);
      dx = disp * Math.cos(theta);
      dy = disp * Math.sin(theta);
      ind = new TransmissionNode(house_location.x + dx, house_location.y + dy,
                                 1, this._randomFloatBetween(0, 1), 0);
      ind_ids.push(ind.id);
      s.graph.addNode(ind);
    }
    var cmb = Combinatorics.combination(ind_ids, 2);
    cmb.forEach((x) => s.graph.addEdge({
      id: 'e_' + cuid(),
      source: x[0],
      target: x[1],
      weight: 1
    }));
  }
  // console.log(ind_ids);
  // console.log(s.graph.nodes(ind_ids[0]));
  // console.log(s.graph.neighbors(ind_ids[0]));
  return s;
};

ns.generateDatum = function(domain) {
  return new TransmissionNode(
      this._randomIntBetween(domain.x[0], domain.x[1]),  // x
      this._randomIntBetween(domain.y[0], domain.y[1]),  // y
      this._randomIntBetween(Z_MIN, Z_MAX),   // weight
      this._randomFloatBetween(0, 1),  // receptivity
      0  // infectiousness
  );
};

ns._randomIntBetween = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

ns._randomFloatBetween = function(min, max) {
  return Math.random() * (max - min) + min;
};

module.exports = ns;
