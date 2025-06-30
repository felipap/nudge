import { app, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import { getImagePath } from './lib/utils'
import { getState, store } from './store'

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

declare const PREF_WINDOW_VITE_DEV_SERVER_URL: string
declare const PREF_WINDOW_VITE_NAME: string

export let mainWindow: BrowserWindow | null = null
export let prefWindow: BrowserWindow | null = null

export function createMainWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()

  const windowWidth = 350
  const windowHeight = 200
  const edgeOffset = 5

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minHeight: windowHeight,
    minWidth: windowWidth,
    resizable: false,
    frame: false,
    transparent: true,
    vibrancy: 'fullscreen-ui',
    show: true,
    // alwaysOnTop: true,
    x:
      primaryDisplay.workArea.x +
      primaryDisplay.workArea.width -
      windowWidth -
      edgeOffset,
    y: primaryDisplay.workArea.y + edgeOffset,
    alwaysOnTop: getState().isWindowPinned,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  // By default in development, the icon is the Electron icon. So we override
  // it.
  if (!app.isPackaged) {
    app.dock.setIcon(getImagePath('icon-development.png'))
  }

  let lastPinnedState = getState().isWindowPinned
  store.subscribe((state) => {
    if (state.isWindowPinned !== lastPinnedState) {
      win.setAlwaysOnTop(state.isWindowPinned, 'floating')
      lastPinnedState = state.isWindowPinned
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

export function createSettingsWindow() {
  const windowWidth = 600
  const windowHeight = 500

  const win = new BrowserWindow({
    show: true,
    // alwaysOnTop: true,
    width: windowWidth,
    height: windowHeight,
    minHeight: windowHeight,
    minWidth: windowWidth,
    center: true,
    resizable: false,
    frame: false,
    transparent: true,
    vibrancy: 'fullscreen-ui',
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
