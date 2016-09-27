/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');

require('./Stats.less');

var Stats = React.createClass({
  render: function() {
    var data = this.props.data;
    var sum_wt = _.reduce(data, (sum, d) => { return sum + d.weight; }, 0);
    var avg_inf, avg_imm;
    var n = data.length;
    if (!n) {
      avg_inf = 0;
      avg_imm = '-';
    }
    else {
      var sum_inf = _.reduce(data, (sum, d) => { return sum + d.weight * d.infectiousness; }, 0);
      var sum_imm = _.reduce(data, (sum, d) => { return sum + d.weight * d.receptivity; }, 0);
      avg_inf = Math.round(sum_inf / sum_wt * 100)/100;
      avg_imm = Math.round(sum_imm / sum_wt * 100)/100;
    }
    return (
      <div className="Stats">
        <div className="Stats-item">{'Population: '}<strong>{sum_wt}</strong></div>
        <div className="Stats-item">{'Average infectiousness: '}<strong>{avg_inf}</strong></div>
        <div className="Stats-item">{'Average receptivity: '}<strong>{avg_imm}</strong></div>
      </div>
    );
  }
});

module.exports = Stats;
