// Utils for capturing the screen.

import { desktopCapturer, screen, systemPreferences } from 'electron'
import fs from 'fs'
import path from 'path'
import { debug, log, warn } from './logger'

export async function tryAskForScrenPermissions(): Promise<{
  status: 'granted' | 'denied' | ''
  error?: string
}> {
  try {
    // Check if we're on macOS (screen recording permissions are macOS-specific)
    if (process.platform !== 'darwin') {
      return { status: 'granted' } // On other platforms, assume granted
    }

    const hasPermission = systemPreferences.getMediaAccessStatus('screen')

    if (hasPermission === 'granted') {
      log('[screen] Screen recording permission already granted')
      return { status: 'granted' }
    }

    // If 'denied', Nudge may be listed under "Screen & System Audio Recording"
    // but toggled off. AFAIK, in that case, we can't get the OS permission
    // dialog to show up again just by calling `getSources`. The user has to go
    // to System Preferences themselves and switch it on. If we get 'denied' but
    // Nudge ISN'T listed in the table (eg. because the user deleted it?), we
    // can get the dialog to show up again by calling `getSources` again.
    //
    // So we don't return early in case of 'denied'.

    // if (hasPermission === 'denied') {
    //   log('[screen] Screen recording permission denied')
    //   return {
    //     granted: false,
    //     error:
    //       'Screen recording permission has been denied. Please enable it in System Preferences > Security & Privacy > Privacy > Screen Recording.',
    //   }
    // }

    debug('[screen] Requesting screen recording permission...')

    let sources
    try {
      sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1, height: 1 },
      })
    } catch (err) {
      warn('[screen] Error during permission request:', err)
      return {
        status: 'denied',
      }
    }

    if (sources.length > 0) {
      log('[screen] Screen recording permission granted')
      return { status: 'granted' }
    } else {
      log('[screen] No screen sources available after permission request')
      return {
        status: 'denied',
        error:
          'No screen sources available. Please check your screen recording permissions.',
      }
    }
  } catch (error) {
    log('[screen] Unexpected error in tryAskForScrenPermissions:', error)
    return {
      status: 'denied',
      error: `Unexpected error: ${error.message}`,
    }
  }
}

export async function checkScreenPermissions(): Promise<boolean> {
  if (process.platform !== 'darwin') {
    return true // On other platforms, assume granted
  }

  const hasPermission = systemPreferences.getMediaAccessStatus('screen')
  // console.log('hasPermission', hasPermission)
  return hasPermission === 'granted'
}

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
  log('[screen] Capturing screen at:', new Date().toISOString())

  // Check permissions first
  const hasPermission = await checkScreenPermissions()
  if (!hasPermission) {
    throw new Error('Screen recording permission required')
  }

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
    log('[screen] Error capturing screen:', e)
    return { error: `Error capturing screen: ${e.message}` }
  }

  // Grant access to the first screen found.
  log('[screen] Screen sources:', sources.length)

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
