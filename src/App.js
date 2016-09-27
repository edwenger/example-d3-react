/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');

var dataGenerator = require('./dataGenerator');

var Pagination = require('./Pagination');
var Chart = require('./Chart');
var Stats = require('./Stats');
var ShowHideTooltips = require('./ShowHideTooltips');
var ModifyData = require('./ModifyData');

require('./App.less');

var App = React.createClass({
  getInitialState: function() {
    var domain = {x: [-50, 50], y: [-20, 20]};
    return {
      data: this.getData(domain),
      domain: domain,
      tooltip: null,
      prevDomain: null,
      showingAllTooltips: false
    };
  },

  _transmission_graph: dataGenerator.generate_households(500, 5).graph,

  getData: function(domain) {
    return _.filter(this._transmission_graph.nodes(), this.isInDomain.bind(null, domain));
  },

  infectDatum: function(domain) {
    var matches = _.filter(this._transmission_graph.nodes(), this.isInDomain.bind(null, domain));
    if (matches.length > 0) {
      _.sample(matches).infectiousness = 1;
    }
    return this.getData(domain);
  },

  immuneDatum: function(domain) {
    var matches = _.filter(this._transmission_graph.nodes(), this.isInDomain.bind(null, domain));
    if (matches.length > 0) {
      _.sample(matches).receptivity = 0;
    }
    return this.getData(domain);
  },

  isInDomain: function(domain, d) {
    return d.x >= domain.x[0] && d.x <= domain.x[1] && d.y >= domain.y[0] && d.y <= domain.y[1];
  },

  render: function() {
    return (
      <div className="App">
        <Pagination
          appState={this.state}
          setAppState={this.setAppState}
          getData={this.getData} />
        <ModifyData
          appState={this.state}
          setAppState={this.setAppState}
          infectDatum={this.infectDatum}
          immuneDatum={this.immuneDatum}/>
        <Chart
          appState={this.state}
          setAppState={this.setAppState} />
        <Stats data={this.state.data} />
      </div>
    );
  },

  setAppState: function(partialState, callback) {
    return this.setState(partialState, callback);
  }
});

module.exports = App;
