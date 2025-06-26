import 'source-map-support/register'

import { app, BrowserWindow } from 'electron'
import started from 'electron-squirrel-startup'
import { setupIPC } from './ipc'
import { screenCaptureService } from './lib/capture-service'
import { onAppClose, onAppStart } from './logic'
import { createTray } from './tray'
import { createMainWindow, createSettingsWindow, prefWindow } from './windows'

async function onInit() {
  createMainWindow()
  createSettingsWindow()
  screenCaptureService.start()
  onAppStart()
  createTray()
  setupIPC()

  // MCP (later)
  // export const mcpApp = createMcpApp()
  // mcpApp.listen(3040, () => {
  //   console.log('MCP Stateless Streamable HTTP Server listening on port 3040')
  // })

  // app.on('activate', () => {
  //   if (BrowserWindow.getAllWindows().length === 0) {
  //     createWindow()
  //   }
  // })

  // setupAutoLaunch()
}

// Function to handle app quitting
async function quitApp() {
  console.log('Will quit.')
  onAppClose()

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

//
//
//
//

// Declare `isQuitting`
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
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
    if (prefWindow) {
      if (prefWindow.isMinimized()) prefWindow.restore()
      prefWindow.focus()
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

app.whenReady().then(() => {
  onInit()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    quitApp()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createSettingsWindow()
  }
})

// Before app quits
app.on('before-quit', () => {
  app.isQuitting = true
})
