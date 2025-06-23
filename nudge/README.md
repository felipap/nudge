# Nudge

AI that watches your computer screen and tells you when you're procrastinating.

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

### To generate the icon

Use this:

```

mkdir images/Production.iconset

# Generate all required icon sizes from your original PNG
sips -z 16 16     images/icon-production.png --out images/Production.iconset/icon_16x16.png
sips -z 32 32     images/icon-production.png --out images/Production.iconset/icon_16x16@2x.png
sips -z 32 32     images/icon-production.png --out images/Production.iconset/icon_32x32.png
sips -z 64 64     images/icon-production.png --out images/Production.iconset/icon_32x32@2x.png
sips -z 128 128   images/icon-production.png --out images/Production.iconset/icon_128x128.png
sips -z 256 256   images/icon-production.png --out images/Production.iconset/icon_128x128@2x.png
sips -z 256 256   images/icon-production.png --out images/Production.iconset/icon_256x256.png
sips -z 512 512   images/icon-production.png --out images/Production.iconset/icon_256x256@2x.png
sips -z 512 512   images/icon-production.png --out images/Production.iconset/icon_512x512.png
sips -z 1024 1024 images/icon-production.png --out images/Production.iconset/icon_512x512@2x.png

# Convert the iconset to icns
iconutil -c icns images/Production.iconset
```

```
mkdir images/Development.iconset

# Generate all required icon sizes from your original PNG
sips -z 16 16     images/icon-development.png --out images/Development.iconset/icon_16x16.png
sips -z 32 32     images/icon-development.png --out images/Development.iconset/icon_16x16@2x.png
sips -z 32 32     images/icon-development.png --out images/Development.iconset/icon_32x32.png
sips -z 64 64     images/icon-development.png --out images/Development.iconset/icon_32x32@2x.png
sips -z 128 128   images/icon-development.png --out images/Development.iconset/icon_128x128.png
sips -z 256 256   images/icon-development.png --out images/Development.iconset/icon_128x128@2x.png
sips -z 256 256   images/icon-development.png --out images/Development.iconset/icon_256x256.png
sips -z 512 512   images/icon-development.png --out images/Development.iconset/icon_256x256@2x.png
sips -z 512 512   images/icon-development.png --out images/Development.iconset/icon_512x512.png
sips -z 1024 1024 images/icon-development.png --out images/Development.iconset/icon_512x512@2x.png

# Convert the iconset to icns
iconutil -c icns images/Development.iconset
```

## License

MIT
