

## Make README Screenshot Smaller

Replace the standard markdown image on line 15 with an HTML `<img>` tag that constrains the width to ~500px, so it displays smaller on GitHub.

### Change

**`README.md` line 15** — replace:
```markdown
![kai — AI relationship coach](docs/kai-chat-screenshot.png)
```
with:
```html
<p align="center">
  <img src="docs/kai-chat-screenshot.png" alt="kai — AI relationship coach" width="500" />
</p>
```

This keeps it centered and caps it at 500px wide instead of filling the full README width. One line changed, no other files affected.

