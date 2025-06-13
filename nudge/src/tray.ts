import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  Tray,
  app,
  ipcMain,
  nativeImage,
} from 'electron'
import path from 'path'
import {
  IndicatorState,
  getNextCaptureAt,
  getOpenAiKey,
  getState,
  getStateIndicator,
  onIndicatorStateChange,
  onOpenAiKeyChange,
  store,
} from './store'
import { mainWindow, prefWindow } from './windows'

dayjs.extend(relativeTime)

function getTrayIconForStatus(status: IndicatorState) {
  const base = app.isPackaged
    ? path.join(process.resourcesPath, 'images')
    : path.join(__dirname, '../../images')

  if (status === 'capturing') {
    return path.join(base, 'nudge-capturing.png')
  } else if (status === 'assessing') {
    return path.join(base, 'nudge-assessing.png')
  } else if (status === 'inactive') {
    return path.join(base, 'nudge-inactive.png')
  } else {
    return path.join(base, 'nudge-default.png')
  }
}

export function createTray() {
  // For a real app, you'd use a proper icon file
  // tray = new Tray(path.join(__dirname, "../../icon.png"))

  const iconPath = getTrayIconForStatus(getStateIndicator())
  const icon = nativeImage.createFromPath(iconPath)
  // if you want to resize it, be careful, it creates a copy
  const trayIcon = icon.resize({ width: 18, quality: 'best' })
  // here is the important part (has to be set on the resized version)
  // trayIcon.setTemplateImage(true)

  const tray = new Tray(trayIcon)

  function getTrayMenu() {
    const hasOpenAiKey = !!getOpenAiKey()
    const needsConfiguration = !hasOpenAiKey

    let template: (MenuItemConstructorOptions | MenuItem | false)[] = []
    if (needsConfiguration) {
      template.push({
        label: 'Enter your OpenAI key',
        click: () => {
          prefWindow.show()
        },
      })
    } else {
      const nextCaptureAt = getNextCaptureAt()
      const captureFromNow = nextCaptureAt
        ? new Date(nextCaptureAt).getTime() - Date.now()
        : null
      const captureStatus =
        captureFromNow === null
          ? 'Not capturing'
          : captureFromNow < 30_000
          ? 'Captured'
          : captureFromNow < 10_000
          ? 'Captured just now'
          : captureFromNow < 0
          ? 'Capturing'
          : captureFromNow < 60_000
          ? `Capturing in ${Math.floor(captureFromNow / 1000)}s`
          : 'Capturing in ' + dayjs(nextCaptureAt).fromNow()

      template = template.concat([
        {
          label: captureStatus,
          click: () => {
            ipcMain.emit('captureNow', null)
            updateTrayMenu()
          },
        },
        {
          label: `${mainWindow.isVisible() ? 'Hide' : 'Show'} window`,
          click: () => {
            if (mainWindow.isVisible()) {
              mainWindow.hide()
            } else {
              mainWindow.show()
            }
            updateTrayMenu()
          },
        },
        { type: 'separator' },
        {
          label: `Float on top`,
          type: 'checkbox',
          checked: getState().isWindowPinned,
          click: () => {
            store.setState({
              ...getState(),
              isWindowPinned: !getState().isWindowPinned,
            })
            updateTrayMenu()
          },
        },

        {
          label: needsConfiguration
            ? 'Enter your OpenAI key...'
            : 'Preferences...',
          click: () => {
            prefWindow.show()
          },
        },
      ])
    }
    template = template.concat([
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          app.isQuitting = true
          app.quit()
        },
      },
    ])

    return template.filter(isTruthy)
  }

  function updateTrayMenu() {
    const contextMenu = Menu.buildFromTemplate(getTrayMenu())

    const status = getStateIndicator()
    const iconPath = getTrayIconForStatus(status)
    const icon = nativeImage.createFromPath(iconPath)
    const resizedIcon = icon.resize({ width: 18, quality: 'best' })
    tray.setImage(resizedIcon)

    // tray.setContextMenu(contextMenu)
    // tray.setTitle(
    //   mood === 'happy'
    //     ? ':D'
    //     : mood === 'angry'
    //     ? '>:('
    //     : mood === 'thinking'
    //     ? '?:/'
    //     : ':|'
    // )
  }

  mainWindow.on('hide', () => {
    updateTrayMenu()
  })

  mainWindow.on('show', () => {
    updateTrayMenu()
  })

  tray.on('click', () => {
    if (mainWindow.isVisible() && !getState().isWindowPinned) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  })

  let lastTrayIconBounds: Electron.Rectangle | null = null

  tray.on('right-click', (event, bounds) => {
    const contextMenu = Menu.buildFromTemplate(getTrayMenu())
    tray.popUpContextMenu(contextMenu)
    lastTrayIconBounds = bounds

    // contextMenu.popup()
  })

  onOpenAiKeyChange(() => {
    updateTrayMenu()
  })

  onIndicatorStateChange(() => {
    updateTrayMenu()
  })

  // Set initial menu
  // tray.setToolTip('Buddy')
  updateTrayMenu()

  // Update every 2 seconds.
  setInterval(() => {
    updateTrayMenu()
  }, 2000)

  // Optional: Show window when clicking the tray icon
  // tray.on("click", () => {
  //   win.isVisible() ? win.hide() : win.show()
  // })

  // Refresh the menu every minute to show updated status
  // setInterval(updateTrayMenu, 60000)

  // Click event (show/hide window)
  // tray.on("click", () => {
  //   if (win?.isVisible()) {
  //     win.hide()
  //   } else {
  //     win?.show()
  //   }
  // })

  return tray
}

type Falsy = false | 0 | '' | null | undefined
const isTruthy = <T>(x: T | Falsy): x is T => !!x
