'use strict';

var greyscale = require('../../../lib/pure/greyscale');
var blur = require('../../../lib/pure/blur');

exports.run = function(data) {
  var gs = greyscale(data.buffer, data.width, data.height);
  return blur(gs, data.width, data.height, 3, 3);
};
