/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');

var dataGenerator = require('./dataGenerator');

var Pagination = require('./Pagination');
var Chart = require('./Chart');
var Stats = require('./Stats');
var ShowHideTooltips = require('./ShowHideTooltips');
var AddRemoveDatum = require('./AddRemoveDatum');

require('./App.less');

var App = React.createClass({
  getInitialState: function() {
    var domain = {x: [0, 100], y: [0, 100]};
    return {
      data: this.getData(domain),
      domain: domain,
      tooltip: null,
      prevDomain: null,
      showingAllTooltips: false
    };
  },

  _allData: dataGenerator.generate(50),

  getData: function(domain) {
    return _.filter(this._allData, this.isInDomain.bind(null, domain));
  },

  addDatum: function(domain) {
    this._allData.push(dataGenerator.generateDatum(domain));
    return this.getData(domain);
  },

  removeDatum: function(domain) {
    var match = _.find(this._allData, this.isInDomain.bind(null, domain));
    if (match) {
      this._allData = _.reject(this._allData, {id: match.id});
    }
    return this.getData(domain);
  },

  infectDatum: function(domain) {
    var matches = _.filter(this._allData, this.isInDomain.bind(null, domain));
    if (matches.length > 0) {
      _.sample(matches).infectiousness = 1;
    }
    return this.getData(domain);
  },

  immuneDatum: function(domain) {
    var matches = _.filter(this._allData, this.isInDomain.bind(null, domain));
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
        <Chart
          appState={this.state}
          setAppState={this.setAppState} />
        <Stats data={this.state.data} />
        {/*<ShowHideTooltips*/}
          {/*appState={this.state}*/}
          {/*setAppState={this.setAppState} />*/}
        <AddRemoveDatum
          appState={this.state}
          setAppState={this.setAppState}
          addDatum={this.addDatum}
          removeDatum={this.removeDatum}
          infectDatum={this.infectDatum}
          immuneDatum={this.immuneDatum}/>
      </div>
    );
  },

  setAppState: function(partialState, callback) {
    return this.setState(partialState, callback);
  }
});

module.exports = App;
