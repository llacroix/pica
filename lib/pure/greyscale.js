// Greyscale filter
//
// http://stackoverflow.com/a/23322820/1031804
// USM(O) = O + (2 * (Amount / 100) * (O - GB))
// GB - gaussial blur.
//
'use strict';

// Convert image to greyscale, 32bits FP result (16.16)
function greyscale(src, srcW, srcH) {
  var size = srcW * srcH;
  var result = new Uint8Array(size); // We don't use sign, but that helps to JIT
  var i, srcPtr;

  for (i = 0, srcPtr = 0; i < size; i++) {
    result[i] = (src[srcPtr + 2] * 7471       // blue
               + src[srcPtr + 1] * 38470      // green
               + src[srcPtr] * 19595) >>> 16;  // red
    srcPtr = (srcPtr + 4)|0;
  }

  return result;
}

module.exports = greyscale;
