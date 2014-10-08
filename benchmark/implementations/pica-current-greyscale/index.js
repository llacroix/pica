'use strict';

var greyscale = require('../../../lib/pure/greyscale');

exports.run = function(data) {
  return greyscale(data.buffer, data.width, data.height);
};
