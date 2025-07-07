import { useEffect } from 'react'
import {
  openSettings,
  useBackendState,
  useScreenPermissionState,
} from '../../shared/ipc'
import { ActiveGoalScreen } from './ActiveGoalScreen'
import { InputScreen } from './InputScreen'
import { OnboardingScreen } from './OnboardingScren'

export default function App() {
  const { state } = useBackendState()
  const { screenPermission } = useScreenPermissionState()
  useGlobalShortcuts()

  let inner
  if (
    !state ||
    // Required so the screen doesn't flicker below.

    screenPermission === null
  ) {
    return <div className="flex flex-col bg-white h-screen">Loading</div>
  } else if (
    !state.modelSelection ||
    !state.modelSelection.key ||
    screenPermission !== 'granted'
  ) {
    inner = <OnboardingScreen />
    // } else if (state.session && state.session.confirmContinue) {
    //   inner = <ConfirmGoalScreen />
  } else if (state.session) {
    inner = <ActiveGoalScreen />
  } else {
    inner = <InputScreen />
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-neutral-900/90 text-[14px] font-display-3p text-contrast">
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
