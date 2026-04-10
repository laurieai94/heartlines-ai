

## Create Kai Demo Video for GitHub

Replace the existing Remotion scenes with a single chat demo that plays the Maya/Kai texting anxiety conversation inside a phone mockup. No changes to the main site — just the `remotion/` directory and a rendered MP4.

### Video Concept

- **Format**: 1080x1920 vertical, ~30s at 30fps (900 frames)
- **Structure**: 3 acts
  1. **Intro (0-60)**: "heartlines" wordmark fades in on burgundy, then phone frame slides up
  2. **Chat (60-750)**: 10 messages appear sequentially inside the phone — Maya's messages appear instantly (right-aligned, coral), Kai's get typing dots first (left-aligned, white). Messages auto-scroll as they fill the screen.
  3. **Outro (750-900)**: Hold on conversation, "heartlines" wordmark + tagline fade in below phone
- **Visual style**: Matches existing brand — burgundy `#33000D` background, coral `#E8735A` accents, CrimsonText font, same phone mockup style as the current Scene2Phone

### Script

1. maya: he hasn't texted me all day. we usually talk by like 11 and it's almost 6 now
2. kai: you're going straight to "something's wrong." what was the first thought that hit you?
3. maya: that he's not into me anymore. or i said something weird last night
4. kai: last time this happened, your mind went here too. quick reality check, how did last night actually feel?
5. maya: honestly really good. we were laughing the whole time. he kissed me goodnight
6. kai: so the pattern is your brain filling the gap fast, even when the connection was solid
7. maya: yeah that sounds right
8. kai: you don't have to figure it all out right now. it's okay to just set a steady tone — "hey, hope your day's not too crazy 😊"
9. maya: i just don't want to seem desperate
10. kai: that makes sense. this isn't chasing — it's you showing up calm and grounded instead of guessing

### Files Changed (remotion/ only)

1. **`remotion/src/scenes/KaiDemoScene.tsx`** — New scene with phone frame, chat messages array, typing indicator, auto-scroll. Builds on the existing Scene2Phone pattern but with all 10 messages and proper timing.
2. **`remotion/src/MainVideo.tsx`** — Replace current 5-scene series with: intro scene, chat scene, outro scene
3. **`remotion/src/scenes/IntroScene.tsx`** — "heartlines" wordmark fade-in
4. **`remotion/src/scenes/OutroScene.tsx`** — Hold + wordmark + tagline
5. **`remotion/src/Root.tsx`** — Update durationInFrames to 900
6. **Render** via existing `scripts/render-remotion.mjs` (update output path to `kai-demo.mp4`)

### Output

`/mnt/documents/kai-demo.mp4` — ready to upload to GitHub. Zero changes to the web app.

