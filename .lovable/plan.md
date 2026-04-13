

## Add flip phone icon to the GitHub README

The flip phone SVG exists at `src/assets/flip-phone.svg`. To show it in the GitHub README next to the heading, we need to:

1. **Copy the SVG to `docs/`** so it's accessible in the repo: copy `src/assets/flip-phone.svg` → `docs/flip-phone.svg`

2. **Update `README.md` line 1** — replace the plain text heading with an inline image + text using HTML:

```html
<h1><img src="docs/flip-phone.svg" alt="flip phone icon" width="32" height="32" style="vertical-align: middle;" /> heartlines ai</h1>
```

This places the flip phone icon right next to the title, matching the style in your screenshot. The icon will render directly on GitHub since SVGs in the repo are supported via relative paths in `<img>` tags.

