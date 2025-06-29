import { app, autoUpdater, dialog } from 'electron'
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

autoUpdater.setFeedURL({
  url: `https://update.electronjs.org/felipap/nudge/darwin-arm64/${app.getVersion()}`,
})

async function onUpdateFound() {
  await dialog.showMessageBox({
    type: 'info',
    message: 'New version available',
    detail: 'Will be installed when you quit.',
    icon: getImagePath('nudge-default.png'),
  })

  try {
    console.log('[updater] quitting and installing')
    autoUpdater.quitAndInstall()
    app.exit()
  } catch (error) {
    console.error('[updater] error', error)
  }
}

// let hasFoundNewVersion = false

function listenForUpdates() {
  autoUpdater.checkForUpdates()

  autoUpdater.on('update-available', async () => {
    console.log('[updater] available')
    // hasFoundNewVersion = true
  })

  autoUpdater.on('update-downloaded', async (event) => {
    console.log('[updater] downloaded', event)
    await onUpdateFound()
  })
}

listenForUpdates()

export async function onClickCheckForUpdates() {
  // if (hasFoundNewVersion) {
  //   // onUpdateFound()
  //   return
  // }

  autoUpdater.checkForUpdates()
}
