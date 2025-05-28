import { app, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import { getState, store } from './store'

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

declare const WIDGET_WINDOW_VITE_DEV_SERVER_URL: string
declare const WIDGET_WINDOW_VITE_NAME: string

declare const PREF_WINDOW_VITE_DEV_SERVER_URL: string
declare const PREF_WINDOW_VITE_NAME: string

export let mainWindow: BrowserWindow | null = null
export let widgetWindow: BrowserWindow | null = null
export let prefWindow: BrowserWindow | null = null

export function createMainWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    show: false,
    frame: false,
    center: true,
    vibrancy: 'fullscreen-ui',
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  // Hide from macOS docker
  // app.dock.hide()

  win.on('show', () => {
    app.dock.show()
  })

  win.on('close', () => {
    app.dock.show()
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

export function createWidgetWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()

  const win = new BrowserWindow({
    width: 350,
    height: 300,
    resizable: true,
    // show: false,
    frame: false,
    x: primaryDisplay.workArea.x + primaryDisplay.workArea.width - 250 - 5,
    y: primaryDisplay.workArea.y + primaryDisplay.workArea.height - 200 - 5,
    vibrancy: 'fullscreen-ui',
    alwaysOnTop: getState().isWidgetPinned,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  let lastPinnedState = getState().isWidgetPinned
  store.subscribe((state) => {
    console.log('change to:', state.isWidgetPinned)
    if (state.isWidgetPinned !== lastPinnedState) {
      console.log(
        'its different. will change isWidgetPinned',
        state.isWidgetPinned,
        lastPinnedState
      )
      win.setAlwaysOnTop(state.isWidgetPinned)
      lastPinnedState = state.isWidgetPinned
    }
  })

  // and load the index.html of the app.
  if (WIDGET_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(WIDGET_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${WIDGET_WINDOW_VITE_NAME}/index.html`)
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

  widgetWindow = win

  return win
}

export function createPreferencesWindow() {
  const win = new BrowserWindow({
    width: 500,
    height: 400,
    resizable: false,
    show: false,
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
