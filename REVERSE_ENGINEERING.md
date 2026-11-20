# Reverse Engineering Report: `https://hacisren.dk/`

This workspace contains the local runnable mirror and de-bundled source code for **`https://hacisren.dk/`**, reverse-engineered using **REA (`rea-agents` v6.7.0)**.

---

## 1. REA Evidence Ledger

All observations and static reconstructions below are backed by immutable REA Evidence records stored in [`rea-evidence/evidence-ledger.json`](file:///Users/mkaan/My%20Mac/Work/Hacisren/rea-evidence/evidence-ledger.json):

| Label | Operation | Evidence ID | Notes & Scope |
| --- | --- | --- | --- |
| `home-capture` | `capture_browser_scenario` | `ev_ef01a58e08c897e441336624a83cc0e29c13d4aecddc26f80c74367feda2491b` | Live homepage capture (`https://hacisren.dk/`) |
| `full-15-page-capture` | `capture_browser_scenario` | `ev_2ef00bbe82e0f6c65e3ac84f953a72fd2ac7ee9ed9f6f173a7c671dbb585d156` | Multi-page capture across all 15 discovered site routes (partial late network omissions on `/referencer`, supplemented by `referencer-capture`) |
| `referencer-capture` | `capture_browser_scenario` | `ev_ddc7bbd1149d87ed97761144b3b439a0f1583dcb57ab1b01018781ced5419a23` | Dedicated `/referencer` capture with 0 omissions |
| `export-home-scripts` | `export_web_scripts` | `ev_4491f6a79b9b01fdcbc20cb0a35bf30cbc3b7c66ca98a36a75ad3adbd962770f` | Exported 13 scripts from homepage capture |
| `export-full-scripts` | `export_web_scripts` | `ev_27acf9fe371c44c8d9d13a839f4ae950f2d50d04838c69777b650e9b78c66fc2` | Exported scripts from 15-page capture |
| `export-referencer-scripts` | `export_web_scripts` | `ev_1453ae23ab8e429e0d73afce717379320998274f9c3000c1c2b5cc46d0a66dd9` | Exported 11 scripts from `/referencer` capture |
| `home-js-analysis` | `analyze_javascript_application` | `ev_fceacb4bd7f53b8c6d5b58b4f4b0de59eee1d904c36de0892566ad6f9309bfb6` | 13/13 files parsed (`0` parse failures, `542,937` AST nodes, `121` findings) |
| `full-js-analysis` | `analyze_javascript_application` | `ev_ad3b1d698e5e7572d3812383e3b1f50c2217760be5fc0947610dcd1e337e5700` | 181/181 files parsed (`0` parse failures, `7,742,129` AST nodes, `2,209` findings) |
| `reconstructed-src-js-analysis` | `analyze_javascript_application` | `ev_b817b967a320d532f70ecd3d1eb11a22d24575d69047b2386829840295b394bf` | Static verification of modular de-bundled [`src/js/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/js): 47/47 files parsed (`0` parse failures, `149,983` AST nodes, `126` findings) |

### Key Limitations
- Browser captures reflect client-side rendered HTML, CSS, JavaScript, images, and fonts served by the production Drupal backend (`controlled-replay` / `historical-reference`); server-side PHP/Twig templates and database contents reside on the origin host and are not directly exposed over HTTP.
- Dynamic server endpoints (such as Drupal Webform submissions and CleanTalk anti-spam tokens) require a live Drupal backend; locally they are served from the static mirror.

---

## 2. Technology Stack & Architecture

Decoded from captured HTTP responses, `drupalSettings` JSON, and Drupal's zlib+base64url `include=` library manifests:

- **CMS**: Drupal `11.4.11` (language: Danish `da`)
- **Agency Platform / Theme Stack**: EasyWeb / Auxo
  - Base theme: `ewbootstrap` (Bootstrap 4, Popper.js, Hammer.js, AOS, Lightbox2, Slick, Isotope, JustifiedGallery, imagesLoaded, SimpleParallax, Modernizr)
  - Custom sub-theme: `ewcustom` (brand accent `#dc7a32` orange, primary dark navy `rgba(30, 33, 66, 0.8)`)
  - Custom block library: `ewblocks`
  - Icon & font CDN (localized into `site/vendor/`): `cdn.auxo.dk/v1/css/all.min.css` (FontAwesome 6 Pro + `custom-icons`) and Google Fonts (`Nunito`, `Roboto`)
- **Modules & Third-Party Integrations**:
  - `webform` (contact/quote forms)
  - `eu_cookie_compliance` (Danish cookie consent banner)
  - `cleantalk` (`apbct-bot-detector`, `apbct-external`, `apbct-public`)
  - `ewrecaptchapagespeedfix` (reCAPTCHA v3 validation scroll + button reordering)
  - Google Analytics (`G-09F8XNFD31`) & Google Tag Manager (`GTM-K3TX4BMV`)
  - Google Maps embed on `/kontakt`
  - Facebook Page SDK embed (`da_DK`, app ID `641662493749100`)

---

## 3. Discovered Routes & Node Mapping

All 15 routes captured across the website (extracted into [`src/config/drupalSettings.json`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/config/drupalSettings.json)):

| Route | Drupal `currentPath` | Page Role |
| --- | --- | --- |
| `/` | `node` | Front page (`Slider4rev3` hero, `Indgangsvinkel8rev2`, `Indgangsvinkel7`, `Slider7rev4`, `FacebookAndWebform2`, `Footer3`, `CTA2`) |
| `/hovedrengoering` | `node/33` | Deep cleaning service page (`Topslider1`) |
| `/polishbehandling` | `node/41` | Floor polishing service page (`Topslider1`) |
| `/rengoering-efter-fest` | `node/38` | Post-party cleaning service page (`Topslider1`) |
| `/special-opgaver` | `node/42` | Special tasks cleaning page (`Topslider1`) |
| `/taepperensning` | `node/39` | Carpet cleaning service page (`Topslider1`) |
| `/klinikrengoering` | `node/37` | Clinic cleaning service page (`Topslider1`) |
| `/kontorrengoering` | `node/36` | Office cleaning service page (`Topslider1`) |
| `/erhvervsrengoering` | `node/32` | Commercial cleaning service page (`Topslider1`) |
| `/privat-rengoering` | `node/54` | Private residential cleaning service page (`Topslider1`) |
| `/om-os` | `node/35` | About us (`Topslider1`) |
| `/vores-maalsaetning` | `node/43` | Mission statement (`Topslider1`) |
| `/priser` | `node/53` | Pricing tables (`page-node-53` custom navy table styling) |
| `/kontakt` | `node/6` | Contact page with Webform and Google Maps |
| `/referencer` | `node/5` | Gallery & references (`Gallery2` with `justifiedGallery`, `isotope`, and `lightbox2`) |

---

## 4. Workspace Structure

- [`site/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/site) — Complete self-contained local runnable mirror (645 files: all 15 HTML pages, Drupal CSS/JS bundles, responsive `<picture>` image styles, Lightbox gallery images, localized Auxo FontAwesome Pro webfonts, and localized Google Fonts).
- [`src/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src) — De-bundled, Prettier-formatted modular source tree:
  - [`src/js/ewblocks/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/js/ewblocks) — 11 block scripts (`CTA2.js`, `FacebookAndWebform2.js`, `Footer3.js`, `Gallery2.js`, `Indgangsvinkel7.js`, `Indgangsvinkel8rev2.js`, `Menu2rev2.js`, `Slider4rev3.js`, `Slider7rev4.js`, `Topslider1.js`, `WebformWithOptionalOnLeft1rev4.js`)
  - [`src/js/ewbootstrap/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/js/ewbootstrap) — 5 theme helper scripts (`global-styling.js`, `jquery-hammer.js`, `recaptcha-pagespeed-fix.js`, `regexp-safety.js`, `touch-passive.js`)
  - [`src/js/drupal/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/js/drupal) — 15 Drupal core, Webform, Views, Cookie Compliance, and CleanTalk modules
  - [`src/js/vendor/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/js/vendor) — 16 third-party vendor libraries
  - [`src/css/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/css) — Reconstructed `ewcustom-global-styling.css`, `ewblocks.css`, `ewbootstrap-theme.css`, and `fonts.css`
  - [`src/config/drupalSettings.json`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/config/drupalSettings.json) — Extracted `drupalSettings` per route
  - [`src/pages/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/src/pages) — All 15 HTML documents
- [`rea-evidence/`](file:///Users/mkaan/My%20Mac/Work/Hacisren/rea-evidence) — REA Evidence ledger, script export manifests, scenario definition, and static analysis results.
- [`server.mjs`](file:///Users/mkaan/My%20Mac/Work/Hacisren/server.mjs) & [`package.json`](file:///Users/mkaan/My%20Mac/Work/Hacisren/package.json) — Local HTTP server for running the mirrored website.

---

## 5. Running Locally

```bash
npm start
```

This starts the local server on `http://127.0.0.1:3000/` (configurable via `PORT` and `HOST` environment variables).
