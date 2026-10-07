/* Microscope engine: widefield light-microscope optics.
   - Abbe resolution: d = 0.61 * lambda / NA (same units as lambda)
   - Field of view: field number / objective magnification
   - Depth of field (widefield estimate, medium n): d = n * lambda / NA^2
   - Useful magnification band: 500x NA to 1000x NA; above the top the extra
     magnification is "empty" - bigger image, no more detail. */
'use strict';
var Microscope = (function () {

  function optics(objMag, na, eyeMag, lambdaNm, fieldNumMm) {
    if (!(objMag > 0) || !(na > 0) || !(eyeMag > 0) || !(lambdaNm > 0) || !(fieldNumMm > 0)) return null;
    var total = objMag * eyeMag;
    var resUm = 0.61 * lambdaNm / na / 1000;
    var fovMm = fieldNumMm / objMag;
    var dofUm = lambdaNm / (na * na) / 1000;
    var bandMin = Math.round(500 * na);
    var bandMax = Math.round(1000 * na);
    return {
      totalMag: total,
      resolutionUm: Math.round(resUm * 1000) / 1000,
      fovMm: Math.round(fovMm * 100) / 100,
      dofUm: Math.round(dofUm * 100) / 100,
      usefulMin: bandMin,
      usefulMax: bandMax,
      empty: total > bandMax,
      belowBand: total < bandMin
    };
  }

  /* Nyquist camera sampling: pixel size at the specimen must be <= d/2.
     With camera adapter magnification M, max sensor pixel (um) = d * M / 2. */
  function maxPixelUm(resUm, camAdapterMag) {
    if (!(resUm > 0) || !(camAdapterMag > 0)) return null;
    return Math.round(resUm * camAdapterMag / 2 * 100) / 100;
  }

  return { optics: optics, maxPixelUm: maxPixelUm };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = Microscope;
