var EventEmitter = require('events').EventEmitter;
var d3 = require('d3');
var colorbrewer = require('colorbrewer');

require('./d3Chart.less');

var ANIMATION_DURATION = 400;
var TOOLTIP_WIDTH = 30;
var TOOLTIP_HEIGHT = 30;

var ns = {};

ns.create = function(el, props, state) {
  var svg = d3.select(el).append('svg')
      .attr('class', 'd3')
      .attr('width', props.width)
      .attr('height', props.height);

  svg.append('g')
      .attr('class', 'd3-points');

  svg.append('g')
      .attr('class', 'd3-tooltips');

  var dispatcher = new EventEmitter();
  this.update(el, state, dispatcher);

  return dispatcher;
};

ns.update = function(el, state, dispatcher) {
  var scales = this._scales(el, state.domain);
  var prevScales = this._scales(el, state.prevDomain);
  this._drawPoints(el, scales, state.data, prevScales, dispatcher);
  this._drawTooltips(el, scales, state.tooltips, prevScales);
};

ns._scales = function(el, domain) {
  if (!domain) {
    return null;
  }

  var width = el.offsetWidth;
  var height = el.offsetHeight;

  var x = d3.scale.linear()
    .range([0, width])
    .domain(domain.x);

  var y = d3.scale.linear()
    .range([height, 0])
    .domain(domain.y);

  var r = d3.scale.sqrt()
    .range([3, 20])
    .domain([1, 100]);

  var fill_c = d3.scale.quantile()
    .range(['#ffffff'].concat(colorbrewer.Reds[9].slice(0, 8)))
    .domain([0, 1]);

  var stroke_c = d3.scale.quantile()
    .range(['#a3c1a6', '#a0b593', '#a0a784', '#a1977a', '#9f8574', '#9a7571', '#8e6470', '#7b546d', '#604463'])  // sns.cubehelix_palette(9, dark=0.1, hue=0.5, light=0.5, start=0, rot=1.3, gamma=0.5).as_hex()
    .domain(_.range(0, 1.0001, 0.1));

  var stroke_w = d3.scale.pow().exponent(2)
    .range([1, 5])
    .domain([0, 1]);

  return {x: x, y: y, r: r, stroke_c: stroke_c, stroke_w: stroke_w, fill_c: fill_c};
};

ns._drawPoints = function(el, scales, data, prevScales, dispatcher) {
  var g = d3.select(el).selectAll('.d3-points');

  var point = g.selectAll('.d3-point')
    .data(data, function(d) { return d.id; });

  point.enter().append('circle')
      .attr('class', 'd3-point')
      .attr('cx', function(d) {
        if (prevScales) {
          return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
      .attr('cy', function(d) {
        if (prevScales) {
          return prevScales.y(d.y);
        }
        return scales.y(d.y);
      })

    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) { return scales.x(d.x); })
      .attr('cy', function(d) { return scales.y(d.y); });

  point.attr('r', function(d) { return scales.r(d.weight); })
      .attr('fill', function(d) { return scales.fill_c(d.infectiousness); })
      .attr('stroke', function(d) { return scales.stroke_c(d.receptivity); })
      .attr('stroke-width', function(d) { return scales.stroke_w(d.receptivity); })
      .on('mouseover', function(d) {
        dispatcher.emit('point:mouseover', d);
      })
      .on('mouseout', function(d) {
        dispatcher.emit('point:mouseout', d);
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('cx', function(d) { return scales.x(d.x); })
      .attr('cy', function(d) { return scales.y(d.y); });

  if (prevScales) {
    point.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', function(d) { return scales.x(d.x); })
        .attr('cy', function(d) { return scales.y(d.y); })
        .remove();
  }
  else {
    point.exit()
        .remove();
  }
};

ns._drawTooltips = function(el, scales, tooltips, prevScales) {
  var g = d3.select(el).selectAll('.d3-tooltips');

  var tooltipRect = g.selectAll('.d3-tooltip-rect')
    .data(tooltips, function(d) { return d.id; });

  tooltipRect.enter().append('rect')
      .attr('class', 'd3-tooltip-rect')
      .attr('width', TOOLTIP_WIDTH)
      .attr('height', TOOLTIP_HEIGHT)
      .attr('x', function(d) {
        if (prevScales) {
          return prevScales.x(d.x) - TOOLTIP_WIDTH/2;
        }
        return scales.x(d.x) - TOOLTIP_WIDTH/2;
      })
      .attr('y', function(d) {
        if (prevScales) {
          return prevScales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT;
        }
        return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT;
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; })
      .attr('y', function(d) { return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT; });

  tooltipRect
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; })
      .attr('y', function(d) { return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT; });

  if (prevScales) {
    tooltipRect.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('x', function(d) { return scales.x(d.x) - TOOLTIP_WIDTH/2; })
        .attr('y', function(d) { return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT; })
        .remove();
  }
  else {
    tooltipRect.exit()
        .remove();
  }

  var tooltipText = g.selectAll('.d3-tooltip-text')
    .data(tooltips, function(d) { return d.id; });

  tooltipText.enter().append('text')
      .attr('class', 'd3-tooltip-text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .text(function(d) { return d.weight; })
      .attr('x', function(d) {
        if (prevScales) {
          return prevScales.x(d.x);
        }
        return scales.x(d.x);
      })
      .attr('y', function(d) {
        if (prevScales) {
          return prevScales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT/2;
        }
          return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT/2;
      })
    .transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x); })
      .attr('y', function(d) { return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT/2; });

  tooltipText.transition()
      .duration(ANIMATION_DURATION)
      .attr('x', function(d) { return scales.x(d.x); })
      .attr('y', function(d) { return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT/2; });

  if (prevScales) {
    tooltipText.exit()
      .transition()
        .duration(ANIMATION_DURATION)
        .attr('x', function(d) { return scales.x(d.x); })
        .attr('y', function(d) { return scales.y(d.y) - scales.r(d.weight)/2 - TOOLTIP_HEIGHT/2; })
        .remove();
  }
  else {
    tooltipText.exit()
        .remove();
  }
};

ns.destroy = function(el) {

};

module.exports = ns;
