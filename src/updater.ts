import { app, autoUpdater, dialog } from 'electron'
import { UPDATE_CHECK_AFTER_STARTUP } from './lib/config'
import { debug } from './lib/logger'
import { getImagePath } from './lib/utils'

// autoUpdater downloads the latest version of the app. Then I think it starts a
// new ShipIt process that waits until the app is closed (whenever that
// happens), and then replaces the old Nudge.app with the new Nudge.app. But
// this swapping fails if the user starts the app again in quick successing,
// before ShipIt is done. The solution I found here
// https://github.com/electron-userland/electron-builder/issues/2317#issuecomment-462808392
// is to create a loop at the start of the app that waits until ShipIt is done.
// But that doesn't work anymore since this
// https://github.com/electron/electron/pull/36130 was merged. Because the mere
// running of the app is enough to prevent the ShipIt update.
//
// I struggled with this for hours and I'm just giving up. I'm going to call
// autoUpdater by default. If the user opens the app and crashes ShipIt,
// whatever. They'll update next time.

// Do a check 2 minutes in.
setTimeout(async () => {
  if (!app.isPackaged) {
    // Don't check for updates in dev mode.
    return
  }

  const status = await asyncCheckForUpdatesAndDownload()
  console.log('[updater] status', status)
  if (status === 'downloaded') {
    await showDownloadedDialog()
  }
}, UPDATE_CHECK_AFTER_STARTUP)

autoUpdater.setFeedURL({
  url: `https://update.electronjs.org/felipap/nudge/darwin-arm64/${app.getVersion()}`,
})

async function showDownloadedDialog() {
  const result = await dialog.showMessageBox({
    type: 'info',
    message: 'Update Available',
    detail: 'A new version of Nudge is ready to be installed.',
    icon: getImagePath('original.png'),
    buttons: ['Install now', 'Install on next launch'],
    defaultId: 0,
    cancelId: 1,
  })

  updaterState = 'downloaded'

  if (result.response === 0) {
    // User chose "Install Now"
    try {
      console.log('[updater] quitting and installing')
      autoUpdater.quitAndInstall()
      app.exit()
    } catch (error) {
      console.error('[updater] error', error)
    }
  }
  // If user chose "Install Later", do nothing - they can continue using the app
}

export let updaterState: 'downloaded' | 'downloading' | null = null

export async function onClickCheckForUpdates() {
  updaterState = 'downloading'

  const status = await asyncCheckForUpdatesAndDownload(async () => {
    // await dialog.showMessageBox({
    //   type: 'info',
    //   message: 'New version available',
    //   detail: 'Being downloaded.',
    //   icon: getImagePath('original.png'),
    // })
  })

  if (status === 'failed') {
    // Maybe we do something here?
    updaterState = null
    return
  }

  if (status === 'not-available') {
    await dialog.showMessageBox({
      type: 'info',
      message: 'No new version available',
      icon: getImagePath('original.png'),
    })
    return
  }

  await showDownloadedDialog()
}

let isCheckingForUpdatesOrDownloading = false

/**
 * Use this instead of calling autoUpdater.checkForUpdates() directly. If we
 * call autoUpdater.checkForUpdates() while another check (and download!) is in
 * progress, Electron throws an uncaught exception.
 * https://github.com/electron/electron/issues/7792
 */
async function asyncCheckForUpdatesAndDownload(
  onAvailableAndDownloading?: () => void
): Promise<'failed' | 'not-available' | 'downloaded'> {
  if (isCheckingForUpdatesOrDownloading) {
    return 'failed'
  }
  isCheckingForUpdatesOrDownloading = true

  const ret = await new Promise<'not-available' | 'downloaded'>((resolve) => {
    function onUpdateNotAvailable() {
      debug('[updater/checkForUpdates] not available')
      autoUpdater.removeListener('update-available', onUpdateAvailable)
      autoUpdater.removeListener('update-not-available', onUpdateNotAvailable)
      resolve('not-available')
    }

    async function onUpdateAvailable() {
      debug('[updater/checkForUpdates] available')
      autoUpdater.removeListener('update-available', onUpdateAvailable)
      autoUpdater.removeListener('update-not-available', onUpdateNotAvailable)

      try {
        onAvailableAndDownloading?.()
      } catch {}
      onDownload(() => {
        resolve('downloaded')
      })
    }

    autoUpdater.on('update-available', onUpdateAvailable)
    autoUpdater.on('update-not-available', onUpdateNotAvailable)

    autoUpdater.checkForUpdates()
  })

  console.log('[updater/checkForUpdates] ret', ret)
  isCheckingForUpdatesOrDownloading = false
  return ret
}

function onDownload(callback: () => void) {
  // if (!app.isPackaged) {
  //   console.log('Cannot wait for download in dev mode')
  //   resolve('not-available')
  //   return
  // }

  function onDownloaded() {
    console.log('[updater] downloaded!?!?')
    autoUpdater.removeListener('update-downloaded', onDownloaded)
    callback()
  }
  autoUpdater.on('update-downloaded', onDownloaded)
}
