# Kendaks R&D guide

A static, multi-page-style single-page site that contains 24 Azure project guides.

## Run locally

```bash
cd kendaks-rd-guide
python -m http.server 8000
```

Open:

- http://localhost:8000

## What’s included
- `index.html` + `styles.css` + `app.js`
- `js/projects.js` (all guide content)
- `assets/step-icons/*.svg` (icons used for each step)
- `assets/diagrams/*.svg` (simple architecture diagrams)

## Notes
This guide is meant as an engineering blueprint. Always validate:
- service limits and regional availability
- latest security/compliance requirements
- cost estimates

