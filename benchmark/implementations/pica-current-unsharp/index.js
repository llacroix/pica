'use strict';

var unsharp = require('../../../lib/pure/unsharp');

exports.run = function(data) {
  // We reuse the same buffer even if the filter
  // changes it. Allocating the sample buffer takes too
  // much time
  return unsharp(data.buffer, data.width, data.height, 100, 1.0, 0);
};
