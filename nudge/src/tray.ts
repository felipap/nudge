// This file is a huge mess, please help.

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  Tray,
  app,
  nativeImage,
  nativeTheme,
} from 'electron'
import path from 'path'
import { screenCaptureService } from './lib/ScreenCaptureService'
import {
  IndicatorState,
  getNextCaptureAt,
  getState,
  getStateIndicator,
  onIndicatorStateChange,
  store,
} from './store'
import { mainWindow, prefWindow } from './windows'

dayjs.extend(relativeTime)

export function getImagePath(name: string) {
  const base = app.isPackaged
    ? path.join(process.resourcesPath, 'images')
    : path.join(__dirname, '../../images')
  return path.join(base, name)
}

function getTrayIconForStatus(status: IndicatorState) {
  // const suffix = nativeTheme.shouldUseDarkColors ? '-white' : ''
  // return path.join(base, `nudge-capturingTemplate.png`)

  if (status === 'capturing') {
    return getImagePath(`nudge-capturing.png`)
  } else if (status === 'assessing') {
    return getImagePath(`nudge-assessing.png`)
  } else if (status === 'inactive') {
    return getImagePath(`nudge-inactive.png`)
  } else {
    return getImagePath(`nudge-default.png`)
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
  trayIcon.setTemplateImage(true)

  // Set up theme change listener
  nativeTheme.on('updated', () => {
    updateTrayMenu()
  })

  const tray = new Tray(trayIcon)

  function buildTrayMenu() {
    const hasOpenAiKey = !!getState().modelSelection.key
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

      // 🟢
      // If there's an active session, show button to capture now.
      const activeSession = getState().session
      if (activeSession) {
        console.log('captureFromNow', captureFromNow)
        const captureStatus =
          captureFromNow === null
            ? 'Status: not capturing'
            : captureFromNow < -30_000
            ? 'Status: captured (stuck?)'
            : captureFromNow < -10_000
            ? 'Status: captured just now'
            : captureFromNow < 0
            ? 'Status: capturing'
            : captureFromNow < 60_000
            ? `Capturing in ${Math.floor(captureFromNow / 1000)}s`
            : 'Capturing in ' + dayjs(nextCaptureAt).fromNow()

        template.push({
          label: captureStatus,
          click: () => {
            screenCaptureService.captureNow()
            // ipcMain.emit('captureNow', null)
            updateTrayMenu()
          },
        })
      }

      template = template.concat([
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
            // If window isn't visible, show it.
            const isPinned = getState().isWindowPinned
            if (!isPinned && !mainWindow.isVisible()) {
              mainWindow.show()
            }

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
    const contextMenu = Menu.buildFromTemplate(buildTrayMenu())
    tray.setContextMenu(contextMenu)

    const status = getStateIndicator()
    const iconPath = getTrayIconForStatus(status)
    const icon = nativeImage.createFromPath(iconPath)
    const resizedIcon = icon.resize({ width: 18, quality: 'best' })
    resizedIcon.setTemplateImage(true)
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

  onIndicatorStateChange(() => {
    updateTrayMenu()
  })

  // Set initial menu
  // tray.setToolTip('Buddy')
  updateTrayMenu()

  // Update every 2 seconds.
  setInterval(() => {
    updateTrayMenu()
  }, 2_000)

  // Optional: Show window when clicking the tray icon
  tray.on('click', () => {
    if (!mainWindow.isVisible()) {
      mainWindow.show()
    }
  })

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
