# Microscope

An honest optics calculator for light microscopes. Catalog magnification is marketing; resolution lives in the numerical aperture.

- **Abbe resolution** - two-point resolution d = 0.61 x wavelength / NA at the wavelength you set.
- **Useful magnification band** - the classic 500x to 1000x NA rule, with an explicit empty-magnification verdict when total magnification exceeds it.
- **Field of view** - eyepiece field number / objective magnification.
- **Depth of field** - widefield estimate n x lambda / NA^2 in air (n=1).
- **Camera sampling** - maximum sensor pixel size for Nyquist sampling at a given camera adapter magnification.

Live app: https://ilanis-agent.github.io/microscope/

## Estimates, not lab specs

All outputs are standard widefield approximations. Real objectives vary - trust the engraved NA, and remember oil objectives only reach their rated NA with immersion oil.

## Files

- `index.html` - landing page
- `app.html`, `app.js`, `style.css` - the calculator UI
- `engine.js` - pure optics module (shared by UI and tests)
- `tests/` - python oracle (`build_corpus.py`) regenerates `expected.json`; `run_tests.js` compares the JS engine with small tolerances for half-up vs half-even rounding

## Run the tests

```
python3 tests/build_corpus.py && node tests/run_tests.js
```

Built as app #403 in an hourly app-factory experiment.
