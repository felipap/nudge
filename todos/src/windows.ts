import { app, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import { getState, store } from './lib/store'

declare const WIDGET_WINDOW_VITE_DEV_SERVER_URL: string
declare const WIDGET_WINDOW_VITE_NAME: string

declare const PREF_WINDOW_VITE_DEV_SERVER_URL: string
declare const PREF_WINDOW_VITE_NAME: string

export let prefWindow: BrowserWindow | null = null
export let todoWindow: BrowserWindow | null = null

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

export function createTodoWindow() {
  const primaryDisplay = screen.getPrimaryDisplay()

  const win = new BrowserWindow({
    width: 250,
    height: 200,
    resizable: true,
    // show: false,
    frame: false,
    x: primaryDisplay.workArea.x + primaryDisplay.workArea.width - 250 - 5,
    y: primaryDisplay.workArea.y + primaryDisplay.workArea.height - 200 - 5,
    vibrancy: 'fullscreen-ui',
    alwaysOnTop: getState().isTodoWindowPinned,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  let lastPinnedState = getState().isTodoWindowPinned
  store.subscribe((state) => {
    console.log('change to:', state.isTodoWindowPinned)
    if (state.isTodoWindowPinned !== lastPinnedState) {
      console.log(
        'its different. will change isTodoWindowPinned',
        state.isTodoWindowPinned,
        lastPinnedState
      )
      win.setAlwaysOnTop(state.isTodoWindowPinned)
      lastPinnedState = state.isTodoWindowPinned
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

  todoWindow = win

  return win
}
