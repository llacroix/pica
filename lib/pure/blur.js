// Box blur filter
//
// The implemntation has been by applying
// a motion blur filter on the vertical and
// horizontal axis.
//
// The blur filter process each rows of the
// image buffer with the motion blur and
// then process each columns of the image
// buffer.
//
// The box blur filter changes the image buffer in
// place.
//
'use strict';

//
// Motion blur can blur vertically or horizontally
//
function motionBlur(buffer, startIndex, increment, size, radius, cache, mul, div) {
  var offset;
  var i = 0;
  var sumValue = 0;
  var maxOffset = startIndex + (size - 1) * increment;
  var windowSize = (radius + 1) * increment;

  for (i=-radius; i<=radius; i++) {
    offset = Math.max(startIndex, startIndex + i*increment);
    sumValue += buffer[offset];
  }

  offset = startIndex;

  for (i=0; i<size; i++) {
    cache[i] = buffer[offset];

    // sumValue / (radius + radius + 1)
    buffer[offset] = (sumValue * mul) >> div;

    sumValue += buffer[Math.min(maxOffset, offset + windowSize)]
                - cache[Math.max(0, i - radius)];

    offset += increment;
  }
}

//
// Filter the buffer horizontally
//
function blurHorizontally(buffer, width, height, radius, cache, mul, div) {
  var y;

  for (y = 0; y < height; y++ ) {
    motionBlur(buffer, y * width, 1, width, radius, cache, mul, div);
  }
}

//
// Filter the buffer vertically
//
function blurVertically(buffer, width, height, radius, cache, mul, div) {
  var x;

  for (x = 0; x < width; x++) {
    motionBlur(buffer, x, width, height, radius, cache, mul, div);
  }
}


function find_divisor(num) {
  var count = 0;

  while (((1<<count) * (1/num)) < 256) {
    count++;
  }

  return count;
}

//
// It returns a blurred buffer without modifying the
// buffer which passed by parameter.
//
function boxBlur(src, width, height, radius, blurIterations) {
  blurIterations = blurIterations || 1;

  if (radius < 1) {
    // If radius is 0 then copy the buffer and return it
    return src;
  }

  var i;
  var diameter = radius + radius + 1;

  var div = find_divisor(diameter);
  var mul = Math.ceil((1<<div)/diameter);

  var cache = new Uint8Array(Math.max(width, height));

  // blur step times with the same radius
  for (i = 0; i < blurIterations; i++) {
    blurHorizontally(src, width, height, radius, cache, mul, div);
    blurVertically(src, width, height, radius, cache, mul, div);
  }

  return src;
}

module.exports = boxBlur;
