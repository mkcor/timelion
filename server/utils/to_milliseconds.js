var _ = require('lodash');
var moment = require('moment');

// map of moment's short/long unit ids and elasticsearch's long unit ids
// to their value in milliseconds
var vals = _.transform([
  ['ms', 'milliseconds', 'millisecond'],
  ['s', 'seconds', 'second', 'sec'],
  ['m', 'minutes', 'minute', 'min'],
  ['h', 'hours', 'hour'],
  ['d', 'days', 'day'],
  ['w', 'weeks', 'week'],
  ['M', 'months', 'month'],
  ['quarter'],
  ['y',  'years', 'year']
], function (vals, units) {
  var normal = moment.normalizeUnits(units[0]);
  var val = moment.duration(1, normal).asMilliseconds();
  [].concat(normal, units).forEach(function (unit) {
    vals[unit] = val;
  });
}, {});
// match any key from the vals object prececed by an optional number
var parseRE = new RegExp('^(\\d+(?:\\.\\d*)?)?\\s*(' + _.keys(vals).join('|') + ')$');

var toMs = function (expr) {
  var match = expr.match(parseRE);
  if (match) {
    return parseFloat(match[1] || 1) * vals[match[2]];
  }
};

module.exports = toMs;