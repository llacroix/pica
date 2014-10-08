// Unsharp mask filter
//
// http://stackoverflow.com/a/23322820/1031804
// USM(O) = O + (2 * (Amount / 100) * (O - GB))
// GB - gaussial blur.
//
'use strict';

var boxBlur = require('./blur');
var greyscale = require('./greyscale');

function clampTo8(i) { return i < 0 ? 0 : (i > 255 ? 255 : i); }

// Apply unsharp mask to src
//
// NOTE: radius is ignored to simplify gaussian blur calculation
// on practice we need radius 0.3..2.0. Use 1.0 now.
//
function unsharp(src, srcW, srcH, amount, radius, threshold) {
  var x, y, c, diff = 0, srcPtr, corr;

  // Convert to grayscale:
  //
  // - prevent color drift
  // - speedup blur calc
  //
  var gs = greyscale(src, srcW, srcH);
  var blurred = boxBlur(new Uint8Array(gs), srcW, srcH, radius, 3);

  var gsPtr = 0;
  for (y = 0; y < srcH; y++) {
    for (x = 0; x < srcW; x++) {

      // calculate brightness blur, difference & update source buffer
      diff = (gs[gsPtr] - (blurred[gsPtr++]))|0;

      // Update source image if thresold exceeded
      if (Math.abs(diff) > threshold) {
        // Calculate correction multiplier
        corr = (diff * amount) >> 8;

        srcPtr = (x + y * srcW) * 4;

        c = src[srcPtr];
        src[srcPtr++] = clampTo8(c + corr|0);
        c = src[srcPtr];
        src[srcPtr++] = clampTo8(c + corr|0);
        c = src[srcPtr];
        src[srcPtr]   = clampTo8(c + corr|0);
      }

    } // end row
  } // end column
}

module.exports = unsharp;
