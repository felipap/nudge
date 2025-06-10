import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { getState, store } from './lib/store'

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

declare const PREF_WINDOW_VITE_DEV_SERVER_URL: string
declare const PREF_WINDOW_VITE_NAME: string

export let mainWindow: BrowserWindow | null = null
export let prefWindow: BrowserWindow | null = null

export function createMainWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 400,
    resizable: false,
    frame: false,
    transparent: true,
    vibrancy: 'fullscreen-ui',
    show: false,
    // alwaysOnTop: true,
    // x: primaryDisplay.workArea.x + primaryDisplay.workArea.width - 100 - 5,
    // y: primaryDisplay.workArea.y + primaryDisplay.workArea.width - 50,
    alwaysOnTop: getState().isGoalWindowPinned,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  app.dock.setIcon(path.join(__dirname, '../../images', 'nudge-icon.png'))
  // app.dock.

  let lastPinnedState = getState().isGoalWindowPinned
  store.subscribe((state) => {
    if (state.isGoalWindowPinned !== lastPinnedState) {
      win.setAlwaysOnTop(state.isGoalWindowPinned, 'floating')
      lastPinnedState = state.isGoalWindowPinned
    }
  })

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // Hide window to tray on close instead of quitting
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      win.hide()
      return false
    }
    return true
  })

  // win.setAlwaysOnTop(true, 'floating')

  // Only show DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    // win.webContents.openDevTools({
    //   mode: "bottom",
    // });
  }

  mainWindow = win

  return win
}

export function createPreferencesWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    show: false,
    // alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  // and load the index.html of the app.
  if (PREF_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(PREF_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${PREF_WINDOW_VITE_NAME}/index.html`)
    )
  }

  // Hide window to tray on close instead of quitting
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      win.hide()
      return false
    }
    return true
  })

  // win.setAlwaysOnTop(true, 'floating')

  // Only show DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    // win.webContents.openDevTools({
    //   mode: "bottom",
    // });
  }

  prefWindow = win

  return win
}
