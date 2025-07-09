// This file is a huge mess, please help.

import assert from 'assert'
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
import * as screenCapture from './lib/capture-service'
import { getImagePath, isTruthy } from './lib/utils'
import {
  IndicatorState,
  getNextCaptureAt,
  getState,
  getStateIndicator,
  hasFinishedOnboardingSteps,
  hasNoCurrentGoalOrPaused,
  onIndicatorStateChange,
  store,
} from './store'
import { onClickCheckForUpdates, updaterState } from './updater'
import { mainWindow, prefWindow } from './windows'

dayjs.extend(relativeTime)

export function createTray() {
  assert(mainWindow)
  assert(prefWindow)

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

  async function buildTrayMenu() {
    let template: (MenuItemConstructorOptions | MenuItem | false)[] = []
    if (!hasFinishedOnboardingSteps()) {
    } else {
      const nextCaptureAt = getNextCaptureAt()
      const captureFromNow = nextCaptureAt
        ? new Date(nextCaptureAt).getTime() - Date.now()
        : null

      // 🟢
      // If there's an active session, show button to capture now.
      if (!hasNoCurrentGoalOrPaused()) {
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
            screenCapture.triggerCaptureAssessAndNudge()
            // ipcMain.emit('captureNow', null)
            updateTrayMenu()
          },
        })
        template.push({ type: 'separator' })
      }

      template = template.concat([
        // {
        //   label: `${mainWindow!.isVisible() ? 'Hide' : 'Show'} window`,
        //   click: () => {
        //     if (mainWindow!.isVisible()) {
        //       mainWindow!.hide()
        //     } else {
        //       mainWindow!.show()
        //     }
        //     updateTrayMenu()
        //   },
        // },
        // { type: 'separator' },
        {
          label: `Keep window on top`,
          type: 'checkbox',
          checked: getState().isWindowPinned,
          click: () => {
            // If window isn't visible, show it.
            const isPinned = getState().isWindowPinned
            if (!isPinned && !mainWindow!.isVisible()) {
              mainWindow!.show()
            }

            store.setState({
              ...getState(),
              isWindowPinned: !getState().isWindowPinned,
            })
            updateTrayMenu()
          },
        },
      ])
    }
    template = template.concat([
      {
        label: 'Settings...',
        accelerator: 'CmdOrCtrl+,',
        click: () => {
          prefWindow!.show()
        },
      },
      { type: 'separator' },
      {
        label: `Version ${app.getVersion()}`,
        enabled: false,
      },
    ])

    if (updaterState === 'downloaded') {
      template.push({
        label: 'Quit & install update',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit()
        },
      })
    } else {
      template.push({
        enabled: updaterState !== 'downloading',
        label:
          updaterState === 'downloading'
            ? 'Downloading update...'
            : 'Check for updates...',
        click: async () => {
          await onClickCheckForUpdates()
        },
      })
      template.push({
        label: 'Quit',
        sublabel: '⌘Q',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          // app.isQuitting = true // Do we need this?
          app.quit()
        },
      })
    }

    return template.filter(isTruthy)
  }

  async function updateTrayMenu() {
    const contextMenu = Menu.buildFromTemplate(await buildTrayMenu())
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
    if (!mainWindow!.isVisible()) {
      mainWindow!.show()
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

function getTrayIconForStatus(status: IndicatorState) {
  // const suffix = nativeTheme.shouldUseDarkColors ? '-white' : ''
  // return path.join(base, `nudge-capturingTemplate.png`)

  if (status === 'capturing') {
    return getImagePath(`nudge-capturing.png`)
  } else if (status === 'assessing') {
    return getImagePath(`nudge-assessing.png`)
  } else if (status === 'inactive' || status === 'paused') {
    return getImagePath(`nudge-inactive.png`)
  } else {
    return getImagePath(`nudge-default.png`)
  }
}
