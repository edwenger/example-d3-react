/** @jsx React.DOM */

var React = require('react');
var _ = require('lodash');

var Pagination = React.createClass({
  render: function() {
    return (
      <p>
        {'Pages: '}
        <a href="#" onClick={this.handleLeft}>Left</a>
        <span> - </span>
        <a href="#" onClick={this.handleRight}>Right</a>
        <span> - </span>
        <a href="#" onClick={this.handleUp}>Up</a>
        <span> - </span>
        <a href="#" onClick={this.handleDown}>Down</a>
        <span> - </span>
        <a href="#" onClick={this.handleZoomIn}>Zoom In</a>
        <span> - </span>
        <a href="#" onClick={this.handleZoomOut}>Zoom Out</a>
      </p>
    );
  },

  handleLeft: function(e) {
    e.preventDefault();
    this.shiftData({x: -20, y: 0});
  },

  handleRight: function(e) {
    e.preventDefault();
    this.shiftData({x: +20, y: 0});
  },

  handleUp: function(e) {
    e.preventDefault();
    this.shiftData({x: 0, y: +20});
  },

  handleDown: function(e) {
    e.preventDefault();
    this.shiftData({x: 0, y: -20});
  },

  handleZoomIn: function(e) {
    e.preventDefault();
    this.zoomData(0.5);
  },

  handleZoomOut: function(e) {
    e.preventDefault();
    this.zoomData(2);
  },

  shiftData: function(step) {
    var currentDomain = this.props.appState.domain,
        dimensions = ['x', 'y'],
        newDomain = {};

    dimensions.forEach((dim)=> {
      newDomain[dim] = _.map(currentDomain[dim], function (x) {
        return x + step[dim];
      });
    });

    this.props.setAppState({
      data: this.props.getData(newDomain),
      domain: _.assign({}, this.props.appState.domain, newDomain),
      tooltips: [],
      prevDomain: this.props.appState.domain
    });
  },

  zoomData: function(scale) {
    var newDomain = {},
        dimensions = ['x', 'y'],
        currentDomain = this.props.appState.domain;

    dimensions.forEach((dim)=> {
      var midPoint = 0.5 * (currentDomain[dim][0] + currentDomain[dim][1]);
      newDomain[dim] = _.map(currentDomain[dim], function (x) {
        return scale * (x - midPoint) + midPoint;
      });
    });

    this.props.setAppState({
      data: this.props.getData(newDomain),
      domain: _.assign({}, this.props.appState.domain, newDomain),
      tooltips: [],
      prevDomain: this.props.appState.domain
    });
  }
});

module.exports = Pagination;
