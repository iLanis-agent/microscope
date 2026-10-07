'use strict';
/* global Microscope */
(function () {
  const $ = (id) => document.getElementById(id);
  const presets = [
    { n: '4x / 0.10', o: 4, na: 0.10 },
    { n: '10x / 0.25', o: 10, na: 0.25 },
    { n: '40x / 0.65', o: 40, na: 0.65 },
    { n: '100x oil / 1.25', o: 100, na: 1.25 }
  ];
  const prow = $('presets');
  presets.forEach((p) => {
    const b = document.createElement('button');
    b.textContent = p.n;
    b.addEventListener('click', () => { $('obj').value = p.o; $('na').value = p.na; run(); });
    prow.appendChild(b);
  });

  function run () {
    const o = parseFloat($('obj').value), na = parseFloat($('na').value);
    const eye = parseFloat($('eye').value), lam = parseFloat($('lam').value);
    const fn = parseFloat($('fn').value), cam = parseFloat($('cam').value);
    const r = Microscope.optics(o, na, eye, lam, fn);
    if (r === null) {
      $('out').innerHTML = '<p>Every value must be positive (wavelength 380-750 nm is visible light).</p>';
      return;
    }
    let verdict;
    if (r.empty) verdict = '<span class="warn">Empty magnification - beyond ' + r.usefulMax + 'x the image gets bigger but shows no more detail.</span>';
    else if (r.belowBand) verdict = '<span class="ok">Below the useful band - the optics resolve more than the eye can see; that is normal for scanning objectives.</span>';
    else verdict = '<span class="ok">Inside the useful band (' + r.usefulMin + 'x to ' + r.usefulMax + 'x).</span>';
    const px = Microscope.maxPixelUm(r.resolutionUm, cam);
    $('out').innerHTML =
      '<p class="big">Total magnification ' + r.totalMag + 'x - ' + verdict + '</p>' +
      '<table><tr><th>Quantity</th><th>Value</th></tr>' +
      '<tr><td>Abbe resolution (two-point)</td><td>' + r.resolutionUm + ' um</td></tr>' +
      '<tr><td>Field of view diameter</td><td>' + r.fovMm + ' mm</td></tr>' +
      '<tr><td>Depth of field (widefield estimate)</td><td>' + r.dofUm + ' um</td></tr>' +
      '<tr><td>Useful magnification band</td><td>' + r.usefulMin + 'x to ' + r.usefulMax + 'x</td></tr>' +
      (px !== null ? '<tr><td>Max camera pixel for Nyquist (' + cam + 'x adapter)</td><td>' + px + ' um on the sensor</td></tr>' : '') +
      '</table>';
  }

  ['obj', 'na', 'eye', 'lam', 'fn', 'cam'].forEach((id) => $(id).addEventListener('input', run));
  run();
})();
