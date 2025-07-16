import { useEffect, useState } from 'react'
import {
  openGithubDiscussion,
  openSettings,
  useBackendState,
} from '../../shared/ipc'
import { ActiveSessionScreen } from './ActiveSessionScreen'
import { InputScreen } from './InputScreen'
import { OnboardingScreen, useOnboardingState } from './OnboardingScren'

export const DEFAULT_BG_CLASS = 'bg-gray-100 dark:bg-gray-800/90'

export default function App() {
  const { state } = useBackendState()
  const { hasScreenPermission, isLoading, hasConfiguredBackend } =
    useOnboardingState()

  useGlobalShortcuts()

  let inner
  if (
    !state ||
    // Needed so the OnboardingScreen doesn't flicker below.
    isLoading
  ) {
    return <LoadingScreenWithHelp />
  } else if (!hasScreenPermission || !hasConfiguredBackend) {
    inner = <OnboardingScreen />
  } else if (state.session) {
    inner = <ActiveSessionScreen />
  } else {
    inner = <InputScreen />
  }

  return (
    <div className="flex flex-col h-screen text-[14px] font-display-3p text-contrast">
      {inner}
    </div>
  )
}

function useGlobalShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === ',') {
        // Open settings
        openSettings()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}

function LoadingScreenWithHelp() {
  const [shouldShowHelp, setShouldShowHelp] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShouldShowHelp(true)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col bg-white h-screen p-3 text-sm">
      <span className="font-medium">Loading Nudge...</span>
      {shouldShowHelp ? (
        <div className="mt-3 text-red-900 dark:text-red-500">
          <p>
            Nudge looks stuck.{' '}
            <button
              className="text-link"
              onClick={() => openGithubDiscussion()}
            >
              Get help on GitHub?
            </button>
          </p>
        </div>
      ) : null}
    </div>
  )
}
