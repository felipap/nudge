import { CameraIcon, Monitor, ScreenShareOff } from 'lucide-react'
import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import {
  openGithubDiscussion,
  openSystemSettings,
  tryAskForScrenPermissions,
  useScreenPermissionState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { withBoundary } from '../../../shared/ui/withBoundary'
import { TabButton } from '../Nav'

export function ScreenPermissionIcon({
  active,
  onClick,
}: {
  active: boolean
  onClick: () => void
}) {
  const { screenPermission } = useScreenPermissionState()

  return (
    <TabButton
      title="Screen"
      icon={
        <div className="flex items-center justify-center h-[21px] gap-1 relative">
          {screenPermission === 'granted' ? (
            <Monitor className="w-[23px]" />
          ) : (
            <ScreenShareOff className="w-[23px]" />
          )}
        </div>
      }
      onClick={onClick}
      isActive={active}
      className={
        screenPermission === 'granted'
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-500 dark:text-red-400'
      }
    />
  )
}

export const ScreenPermissions = withBoundary(() => {
  useWindowHeight(500)
  const { screenPermission } = useScreenPermissionState()

  // By default, try to ask for permission when the user opens the settings.
  // There's no reasonable way to implement a "Grant" button, because the OS
  // only shows the dialog to the user once, and we can't even know when the
  // user chooses to deny it.
  useEffect(() => {
    if (screenPermission !== 'granted') {
      tryAskForScrenPermissions()
    }
  }, [screenPermission])

  return (
    <main className="p-4 flex flex-col gap-5 font-display-3p text-[14px] leading-[1.4] h-full justify-between">
      <section className="flex items-start gap-3 pr-5">
        <div className="w-12 flex items-center justify-center">
          <CameraIcon className="w-5 h-5 text-gray-700 mt-1 dark:text-gray-300 shrink-0" />
        </div>
        <p className="text-[14px] leading-[1.4] text-secondary">
          Nudge takes screenshots periodically and sends them directly to your
          chosen model for analysis. Your screenshots are not sent to any other
          servers.
        </p>
      </section>

      <section className="flex flex-row justify-between bg-apple-system-gray-6 dark:bg-apple-system-gray-4 p-4 py-3 rounded-md shadow-sm pr-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1  justify-between">
            <div className="text-contrast text-[15px] font-medium antialiased font-display-3p">
              Permission to capture your screen
            </div>
          </div>
          {screenPermission !== 'granted' && (
            <div className="flex flex-col gap-2">
              <p className="text-secondary [&>strong]:text-contrast/80 [&>strong]:font-normal pr-10">
                Go to <strong>System Settings</strong> &gt;{' '}
                <strong>Privacy &amp; Security</strong> &gt;{' '}
                <strong>Screen Recording</strong>, find Nudge in the list and
                turn the switch on.
              </p>
              <button
                onClick={() => {
                  openSystemSettings()
                }}
                className="self-start text-link hover:underline text-[13px]"
              >
                Open System Settings
              </button>
            </div>
          )}
        </div>{' '}
        <div
          className={twMerge(
            'font-medium text-[15px] text-nowrap',
            screenPermission === 'granted'
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-500 dark:text-red-400'
          )}
        >
          {screenPermission === 'granted' ? 'Granted' : 'Not granted'}
        </div>
      </section>

      <div className="flex flex-col gap-1 flex-1"></div>

      <NeedHelpFooter />
    </main>
  )
})

export function NeedHelpFooter() {
  return (
    <div className="text-secondary">
      Need help? Ask questions on{' '}
      <button
        onClick={() => {
          openGithubDiscussion()
        }}
        className="text-link hover:underline"
      >
        GitHub
      </button>
      .
    </div>
  )
}
