# Nudge

AI that watches your computer screen and tells you when you're procrastinating.

## To-dos

- [ ] Fix window still resizable.
- [ ] Fix framer-motion causing 504 issues with Vite.
- [ ] Allow users to modify screenshot frequency.
- [ ] Let users introspect logs.
- [ ] Come up with an icon for release.
- [ ] After restart past session goal, ask user what they want to do.
- [x] Show how long goal has been active for.
- [x] Issue: can't close the window.
- [x] Use natural language to set goal duration.

## Stack

- Electron
- Vite
- Tailwind v4
- OpenAI

~~Screenshots are stored in `~/nudge-data/screenshots` and are captured every 5
minutes by default.~~

## Development

You know the drill:

```bash
pnpm install
pnpm run dev
```

### Project Structure

- `src/background/` - Screenshot capture service
- `src/preferences/` - App configuration
- `window/` - UI components

### To update the icon

Use this:

```
# Create the iconset directory
mkdir MyIcon.iconset

# Generate all required icon sizes from your original PNG
sips -z 16 16     icon.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out MyIcon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out MyIcon.iconset/icon_512x512@2x.png

# Convert the iconset to icns
iconutil -c icns MyIcon.iconset
```

## License

MIT
