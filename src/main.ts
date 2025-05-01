import 'source-map-support/register'

import { app, BrowserWindow, Tray } from 'electron'
import started from 'electron-squirrel-startup'
import { setupIPC } from './ipc'
import { screenCaptureService } from './lib/ScreenCaptureService'
import { createTray } from './tray'
import { createPreferencesWindow } from './windows'

export let prefsWindow: BrowserWindow
export let tray: Tray

// Declare isQuitting property for TypeScript
declare global {
  namespace Electron {
    interface App {
      isQuitting?: boolean
    }
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit()
}

app.setAppUserModelId(app.getName())

// Prevent multiple instances of the app
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  console.log('Did not get lock. Quitting.')
  quitApp()
} else {
  app.on('second-instance', (event, commandLine) => {
    // Someone tried to run a second instance, focus our window instead
    if (prefsWindow) {
      if (prefsWindow.isMinimized()) prefsWindow.restore()
      prefsWindow.focus()
    }

    // // Protocol handler for win32
    // // argv: ["electron.exe", "--", "buddy://auth/callback?session_token=..."]
    // if (process.platform === 'win32') {
    //   const url = commandLine.pop()
    //   if (url) {
    //     handleProtocolCallback(url)
    //   }
    // }
  })
}

/**
 * Set up app to launch at login
 */
function setupAutoLaunch(enable = true): void {
  app.setLoginItemSettings({
    openAtLogin: enable,
    openAsHidden: true, // Start the app minimized to tray
  })
}

// function createWindow() {
//   window = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (app.isPackaged) {
//     window.loadFile(path.join(__dirname, '../renderer/index.html'))
//   } else {
//     window.loadURL('http://localhost:5173')
//   }

//   // Initialize ClerkAuth with the window
//   initializeClerkAuth(window)
// }

app.whenReady().then(() => {
  // Register protocol handler
  if (!app.isDefaultProtocolClient('buddy')) {
    app.setAsDefaultProtocolClient('buddy')
  }

  prefsWindow = createPreferencesWindow()
  screenCaptureService.start()
  tray = createTray()

  setupIPC()

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

  // app.on('activate', () => {
  //   if (BrowserWindow.getAllWindows().length === 0) {
  //     createWindow()
  //   }
  // })

  // setupAutoLaunch()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    quitApp()
  }
})

// Function to handle app quitting
async function quitApp() {
  console.log('Will quit.')

  // if (!app.isPackaged) {
  //   const { response } = await dialog.showMessageBox({
  //     type: "question",
  //     buttons: ["Yes", "No"],
  //     title: "Confirm",
  //     message: "Are you sure you want to quit?",
  //   })

  //   if (response === 1) return // User clicked "No"
  // }

  app.isQuitting = true
  if (screenCaptureService) {
    screenCaptureService.stop()
  }
  app.quit()
  process.exit(0)
}

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createPreferencesWindow()
  }
})

// Before app quits
app.on('before-quit', () => {
  app.isQuitting = true
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
