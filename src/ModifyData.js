/** @jsx React.DOM */

var React = require('react');

var ModifyData = React.createClass({
  render: function() {
    return (
      <p>
        {'Data points: '}
        <a href="#" onClick={this.handleInfect}>Infect</a>
        <span> - </span>
        <a href="#" onClick={this.handleImmune}>Immune</a>
      </p>
    );
  },

  handleInfect: function(e) {
    e.preventDefault();
    var domain = this.props.appState.domain;
    this.props.setAppState({
      data: this.props.infectDatum(domain),
      prevDomain: null
    });
  },

  handleImmune: function(e) {
    e.preventDefault();
    var domain = this.props.appState.domain;
    this.props.setAppState({
      data: this.props.immuneDatum(domain),
      prevDomain: null
    });
  }
});

module.exports = ModifyData;
