

## Add Product Screenshot to GitHub README

The user wants their uploaded screenshot (showing the actual Kai chat interface) added to the README.md for the GitHub product image section.

### Plan

1. **Copy the uploaded screenshot** into the repo at `docs/kai-chat-screenshot.png` (the `docs/` directory already exists and is a clean place for README assets)

2. **Update README.md** to add the screenshot below the intro section (after the "Live app" line, before "Why I Built heartlines"). Add a simple image embed:
   ```markdown
   ## Product
   
   ![kai — AI relationship coach](docs/kai-chat-screenshot.png)
   ```

This will display the screenshot directly on the GitHub page as the product image.

### Files Changed
- `docs/kai-chat-screenshot.png` — copy from uploaded image
- `README.md` — add image section around line 13

