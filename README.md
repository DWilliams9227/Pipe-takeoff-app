# Pipe Takeoff 0.3 — phone-first web app

Adds a **Press spacing** tab for Viega ProPress and NIBCO Press System, with separate rules by nominal pipe size. Users can enter manufacturer-source minimum exposed gaps, save them locally, and compare proposed exposed pipe spacing. All rules remain **user-entered/unverified**; no manufacturer data is invented. Press-tool clearance and pipe insertion depths are separate requirements.

Retains Version 0.2 fitting measurements, takeoffs, calculators and JSON backup/restore. The existing localStorage key remains unchanged to preserve saved data when updating the same GitHub Pages site.

## Update GitHub Pages from Android

Extract the ZIP. Upload the six files in this folder (`index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `service-worker.js`, `README.md`) to the **root** of your existing GitHub repository, replacing existing files. Do not upload the ZIP itself or the enclosing folder. Commit changes and wait for Pages deployment. Reload the live app; if an older version persists, close and reopen it or clear only the site's cache (avoid clearing site storage unless you've exported a backup).

## Safety

Do not rely on user-entered spacing rules for installation compliance until checked against the current manufacturer's instructions for exact product line, nominal size, pipe material and pressing tool. No verified manufacturer spacing values are shipped in this release.

## Version 0.4
Material-dependent connection and fitting-type dropdowns for both library filters and custom fitting entry. Manufacturer and style input placeholders are contextual suggestions, not verified compatibility lists. Existing local storage remains unchanged.
