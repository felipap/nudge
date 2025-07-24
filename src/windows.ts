import { app, BrowserWindow, screen } from 'electron'
import path from 'node:path'
import {
  getState,
  hasFinishedOnboardingSteps,
  isOnboardingFinished,
  store,
} from './store'

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

declare const PREF_WINDOW_VITE_DEV_SERVER_URL: string
declare const PREF_WINDOW_VITE_NAME: string

declare const ONBOARD_WINDOW_VITE_DEV_SERVER_URL: string
declare const ONBOARD_WINDOW_VITE_NAME: string

export let mainWindow: BrowserWindow | null = null
export let prefWindow: BrowserWindow | null = null
export let onboardWindow: BrowserWindow | null = null

export function createWindows() {
  createMainWindow()
  createSettingsWindow()

  if (!isOnboardingFinished()) {
    createOnboardingWindow()
  }
}

function createMainWindow() {
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
    show: false,
    // alwaysOnTop: true,
    x:
      primaryDisplay.workArea.x +
      primaryDisplay.workArea.width -
      windowWidth -
      edgeOffset,
    y: primaryDisplay.workArea.y + edgeOffset,
    webPreferences: {
      preload: path.join(__dirname, '../renderer/preload.js'),
      webSecurity: false,
    },
  })

  // In development, the default icon is Electron's. So we override it.
  if (!app.isPackaged) {
    // app.dock.setIcon('images/icon-development.png')
  }
  // app.dock.setIcon(getImagePath('icon-development.png'))

  // Pin widget?
  function onChangePinnedState() {
    // Only allow pinning if onboarding is complete. Otherwise giving the user
    // the option might be confusing.
    const pin = getState().isWindowPinned && hasFinishedOnboardingSteps()
    win.setAlwaysOnTop(pin, 'floating')
  }
  let lastPinnedState = getState().isWindowPinned
  store.subscribe((state) => {
    if (state.isWindowPinned !== lastPinnedState) {
      onChangePinnedState()
      lastPinnedState = state.isWindowPinned
    }
  })
  onChangePinnedState()
  // -----

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

  // Show window when app is started but only if onboarding is complete.
  if (isOnboardingFinished()) {
    win.show()
  }

  instrumentizeWindow(win)

  mainWindow = win

  return win
}

function createSettingsWindow() {
  const windowWidth = 600
  const windowHeight = 500

  const win = new BrowserWindow({
    // show: !app.isPackaged,
    show: false,
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

  instrumentizeWindow(win)

  prefWindow = win
  return win
}

function createOnboardingWindow() {
  const windowWidth = 600
  const windowHeight = 500

  const win = new BrowserWindow({
    show: false,
    // alwaysOnTop: EXPERIMENTAL,
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
  if (ONBOARD_WINDOW_VITE_DEV_SERVER_URL) {
    win.loadURL(ONBOARD_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(
      path.join(__dirname, `../renderer/${ONBOARD_WINDOW_VITE_NAME}/index.html`)
    )
  }

  instrumentizeWindow(win)

  // Hide window to tray on close instead of quitting
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault()
      win.hide()
      return false
    }
    return true
  })

  onboardWindow = win
  return win
}

function instrumentizeWindow(win: BrowserWindow) {
  // Needed for `useOnViewed.ts`.
  win.on('show', () => {
    win.webContents.send('window-visibility-change', true)
  })
  win.on('hide', () => {
    win.webContents.send('window-visibility-change', false)
  })

  function maybeToggleDockIcon() {
    const isAnyVisible =
      mainWindow?.isVisible() ||
      prefWindow?.isVisible() ||
      onboardWindow?.isVisible()

    if (process.platform === 'darwin') {
      if (isAnyVisible) {
        app.dock.show()
      } else {
        app.dock.hide()
      }
    }
  }

  win.on('show', maybeToggleDockIcon)
  win.on('hide', maybeToggleDockIcon)
}
