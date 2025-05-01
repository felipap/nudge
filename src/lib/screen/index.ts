// Utils for capturing the screen.

import fs from 'fs'
import path from 'path'
import { desktopCapturer, screen } from 'electron'
import { log } from '../logger'
import dayjs from 'dayjs'

export async function captureActiveScreen(): Promise<
  | {
      data: string
      error?: never
    }
  | {
      error: string
      data?: never
    }
> {
  log('[screen.ts] Capturing screen at:', new Date().toISOString())

  // https://www.electronjs.org/docs/latest/api/desktop-capturer
  // const sources = await desktopCapturer.getSources({ types: ["screen"] });

  // session.defaultSession.setDisplayMediaRequestHandler(
  //   (request, callback) => {
  //     log("request", request);

  const primaryDisplay = screen.getAllDisplays()[0]

  const { width, height } = primaryDisplay.workAreaSize

  let sources
  try {
    sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.floor(width * (2 / 5)),
        height: Math.floor(height * (2 / 5)),
      },
    })
  } catch (e) {
    log('[screen.ts] Error capturing screen:', e)
    return { error: `Error capturing screen: ${e.message}` }
  }

  // Grant access to the first screen found.
  log('[screen.ts] Screen sources:', sources.length)

  // const jpg = sources[0].thumbnail.toJPEG(80)
  const abspath = path.join(getScreenshotFolder(), `latest.jpg`)
  fs.writeFileSync(abspath, sources[0].thumbnail.toJPEG(80))

  // encodeBase64Bytes

  if (sources.length === 0) {
    return { error: 'No sources found' }
  }

  const dataUrl = sources[0].thumbnail.toDataURL({ scaleFactor: 0.1 })
  return { data: dataUrl }
}

const USER_DATA_PATH = '/Users/felipe/'

function getScreenshotFolder() {
  return USER_DATA_PATH // + '/screenshots'
}

function encodeBase64Bytes(bytes: Uint8Array): string {
  return btoa(
    bytes.reduce((acc, current) => acc + String.fromCharCode(current), '')
  )
}
