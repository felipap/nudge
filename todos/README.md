# todos

Productivity util for macOS that watches your screen and tells you when you're
procrastinating.

## To do

- [ ] Reset goals every day.
- [ ] Allow users to modify frequency
- [ ] Come up with an icon

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
sips -z 16 16     original.png --out MyIcon.iconset/icon_16x16.png
sips -z 32 32     original.png --out MyIcon.iconset/icon_16x16@2x.png
sips -z 32 32     original.png --out MyIcon.iconset/icon_32x32.png
sips -z 64 64     original.png --out MyIcon.iconset/icon_32x32@2x.png
sips -z 128 128   original.png --out MyIcon.iconset/icon_128x128.png
sips -z 256 256   original.png --out MyIcon.iconset/icon_128x128@2x.png
sips -z 256 256   original.png --out MyIcon.iconset/icon_256x256.png
sips -z 512 512   original.png --out MyIcon.iconset/icon_256x256@2x.png
sips -z 512 512   original.png --out MyIcon.iconset/icon_512x512.png
sips -z 1024 1024 original.png --out MyIcon.iconset/icon_512x512@2x.png

# Convert the iconset to icns
iconutil -c icns MyIcon.iconset
```
