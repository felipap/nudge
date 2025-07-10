// I need to work on the design for Nudge until 4pm. This means mostly Figma, maybe some Cursor. It's ok if I use Spotify and Youtube if it's for music.

import { Check, X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import {
  closeWindow,
  openGithubDiscussion,
  openSettings,
  useBackendState,
  useScreenPermissionState,
} from '../../../shared/ipc'
import { useWindowHeight } from '../../../shared/lib'
import { withBoundary } from '../../../shared/ui/withBoundary'

export function useOnboardingState() {
  const { screenPermission } = useScreenPermissionState()
  const { state } = useBackendState()

  const hasConfiguredBackend = !!(
    state &&
    (state.useNudgeCloud || state.modelSelection?.key)
  )

  return {
    hasScreenPermission: screenPermission === 'granted',
    hasConfiguredBackend,
  }
}

export const OnboardingScreen = withBoundary(() => {
  const { hasScreenPermission, hasConfiguredBackend } = useOnboardingState()

  useWindowHeight(250)

  return (
    <div className="p-4 flex flex-col gap-1 [app-region:drag] h-full justify-between relative bg-[#FAFAFA] dark:bg-[#333333AA]">
      {/* Close button */}
      <button
        onClick={closeWindow}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors [app-region:no-drag]"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>

      {/* <img src={'images/original.png'} alt="Nudge" className="w-10 h-10" /> */}
      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-0.5">
          <h2 className="text-[16px] font-medium">
            Congrats on installing Nudge
          </h2>
          <p className="text-secondary text-[14px] leading-[1.3]">
            Follow these steps to get started.
          </p>
        </header>

        <div className="flex flex-col gap-2 mt-2 text-[14px] [app-region:no-drag] select-none">
          <div
            className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => openSettings('permissions')}
          >
            <StepIcon done={hasScreenPermission} />
            <span className="">Grant permission to take screenshots</span>
          </div>

          <div
            className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => openSettings('general')}
          >
            <StepIcon done={hasConfiguredBackend} />
            <span className="">Choose Nudge Cloud or enter OpenAI key</span>
          </div>
        </div>

        {/* <p className="text-[15px] mt-2">
          Click on the "👉" tray icon and then "Enter your OpenAI key".
        </p> */}
      </section>

      <footer className="[app-region:no-drag] select-none text-secondary text-[13px]">
        Need help? Ask questions on{' '}
        <strong className="font-medium">
          <button
            className="hover:underline text-link"
            onClick={() => {
              openGithubDiscussion()
            }}
          >
            GitHub
          </button>
        </strong>
        .
      </footer>
    </div>
  )
})

function StepIcon({ done }: { done: boolean }) {
  let inner
  if (done) {
    inner = <Check className="w-3.5 h-3.5 stroke-4 text-white" />
  }

  return (
    <span
      className={twMerge(
        'w-4 h-4 flex items-center justify-center rounded text-white',
        done ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-gray-500'
      )}
    >
      {inner}
    </span>
  )
}
