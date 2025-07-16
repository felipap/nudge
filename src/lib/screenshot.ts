// Utils for capturing the screen.

import { desktopCapturer, screen, systemPreferences } from 'electron'
import { CAPTURE_RESIZE_FACTOR } from './config'
import { debug, log, warn } from './logger'

// ⬇️ wtf is this for?
//
// session.defaultSession.setDisplayMediaRequestHandler(
//   (request, callback) => {
//     desktopCapturer.getSources({ types: ["screen"] }).then((sources) => {
//       // Grant access to the first screen found.
//       callback({ video: sources[0], audio: "loopback" })
//     })
//     // If true, use the system picker if available.
//     // Note: this is currently experimental. If the system picker
//     // is available, it will be used and the media request handler
//     // will not be invoked.
//   },
//   { useSystemPicker: true }
// )

export async function tryAskForScrenPermissions(): Promise<{
  status: 'granted' | 'denied' | ''
  error?: string
}> {
  // Screen recording permissions are macOS-specific.
  if (process.platform !== 'darwin') {
    return { status: 'granted' }
  }

  let hasPermission: string | undefined
  try {
    // TODO double check if this can throw
    hasPermission = systemPreferences.getMediaAccessStatus('screen') as string
  } catch (error) {
    log('[screen] systemPreferences.getMediaAccessStatus threw:', error)
    return {
      status: 'denied',
      error: `Unexpected error: ${error.message}`,
    }
  }

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
}

export function checkScreenPermissions(): boolean {
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
  const hasPermission = checkScreenPermissions()
  if (!hasPermission) {
    return {
      error: 'No permission to capture',
    }
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
        width: Math.floor(width * CAPTURE_RESIZE_FACTOR),
        height: Math.floor(height * CAPTURE_RESIZE_FACTOR),
      },
    })
  } catch (e) {
    log('[screen] Error capturing screen:', e)
    return { error: `Error capturing screen: ${e.message}` }
  }

  log('[screen] Screen sources:', sources.length)

  if (sources.length === 0) {
    return { error: 'No sources found' }
  }

  const dataUrl = sources[0].thumbnail.toDataURL({ scaleFactor: 0.1 })
  return { data: dataUrl }
}
