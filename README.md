# Pipe Takeoff — Version 0.2 prototype

This is a working mobile-friendly web app prototype, **not an Android APK**.

## New in 0.2
- Add your own fitting measurement records (manufacturer, style, material, size, dimension, source).
- Filter and delete saved measurements. All user-entered measurements remain labeled **not verified**.
- Create job projects, add fitting descriptions/quantities/notes, export CSV.
- Export and restore JSON backups of projects and fitting records.
- Existing travel and cut-length calculators, with manual allowances.
- Offline app shell via service worker after first load from HTTPS/localhost.

## How to run
Extract the ZIP, then host the directory using HTTPS or `python -m http.server 8000` and open the address in a browser. Directly opening `index.html` may work for calculations but will not enable service-worker offline caching.

## Important
Data lives in browser localStorage on that device and browser. Clearing browser data may erase it. Export backups frequently. No manufacturer measurements are bundled or verified yet. Cut-length calculations require matching reference points and manually entered allowances.

## Next
Add official source-verified manufacturer fitting catalogs, dimensional diagrams, fractional input in calculators, fitting-to-project linking, and Android packaging.
