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
  getCurrentGoalText,
  getMood,
  getNextCaptureAt,
  getOpenAiKey,
  onMoodChange,
  onOpenAiKeyChange,
} from './lib/store'
import { mainWindow, prefWindow } from './windows'

dayjs.extend(relativeTime)

export function createTray() {
  // For a real app, you'd use a proper icon file
  // tray = new Tray(path.join(__dirname, "../../icon.png"))

  let iconPath
  if (app.isPackaged) {
    iconPath = path.join(process.resourcesPath, 'images', 'nudge-tray.png')
  } else {
    iconPath = path.join(__dirname, '../../images', 'nudge-tray.png')
  }
  // iconPath = path.join(__dirname, '../../images', 'todos-icon.png')

  const icon = nativeImage.createFromPath(iconPath)
  // if you want to resize it, be careful, it creates a copy
  const trayIcon = icon.resize({ width: 16 })
  // here is the important part (has to be set on the resized version)
  trayIcon.setTemplateImage(true)

  const tray = new Tray(trayIcon)

  function getTrayMenu() {
    const mood = getMood()

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
      template = template.concat([
        getCurrentGoalText()
          ? {
              label: `Nudge is ${
                mood === 'happy'
                  ? 'pleased, for now'
                  : mood === 'angry'
                  ? 'disappointed'
                  : mood === 'thinking'
                  ? 'thinking'
                  : 'waiting'
              }`,
              enabled: false,
            }
          : {
              label: `Set goals`,
              click: () => {
                prefWindow.show()
              },
            },
        { type: 'separator' },
        // {
        //   label: screenCaptureService.isRunning
        //     ? 'Pause screen capture'
        //     : 'Start screen capture',
        //   click: () => {
        //     if (screenCaptureService.isRunning) {
        //       screenCaptureService.stop()
        //     } else {
        //       screenCaptureService.start()
        //     }
        //     updateTrayMenu()
        //   },
        // },
        {
          label: `Capturing ${dayjs(getNextCaptureAt()).fromNow()}`,
          click: () => {
            ipcMain.emit('captureNow', null)
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

    const mood = getMood()
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

  tray.on('click', () => {
    if (mainWindow.isVisible()) {
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

  onMoodChange(() => {
    updateTrayMenu()
  })

  // Set initial menu
  // tray.setToolTip('Buddy')
  updateTrayMenu()

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
