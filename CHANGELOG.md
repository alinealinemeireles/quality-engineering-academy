# Changelog

## 1.0.0 — 2026-09-04

### Release

- Finalised the engineering review and release hardening cycle.
- 182 chapters, 6 learning tracks and 62 modules retained with PT/EN parity.
- 119 authorial certification questions retained with traceability metadata.
- Added reproducibility documentation and audit scripts under `tools/`.
- Added security, contribution and citation metadata.

### Engineering quality

- Corrected statistical, reliability, MSA, acceptance-sampling, OEE, RTY, AI governance and causal-inference statements identified during the engineering reviews.
- Distinguished normative requirements from heuristics and historical benchmarks.
- Hardened generated code blocks against math-markup corruption.
- Hardened browser smoke tests (`tools/check.js`, `tools/check2.js`) to fail on page or console errors when run locally.

### Validation status

The local environment validates the static gates, internationalisation checks, syntax checks and unit tests (`python -m pytest -q`). The build (`tools/build.py`), Chromium smoke tests and native R execution are not wired into continuous integration and must be run locally before tagging a release — see CONTRIBUTING.md.
