import { useEffect } from 'react'
import { openSettings, useBackendState } from '../../shared/ipc'
import { ActiveGoalScreen } from './ActiveGoalScreen'
import { ConfirmGoalScreen } from './ConfirmGoalScreen'
import { EnterKeyScreen } from './EnterKeyScreen'
import { InputScreen } from './InputScreen'

export default function App() {
  const { state } = useBackendState()
  useGlobalShortcuts()

  let inner
  if (!state) {
    return <div className="flex flex-col bg-white h-screen">Loading</div>
  } else if (!state.modelSelection || !state.modelSelection.key) {
    inner = <EnterKeyScreen />
  } else if (state.session && state.session.confirmContinue) {
    inner = <ConfirmGoalScreen />
  } else if (state.session) {
    inner = <ActiveGoalScreen />
  } else {
    inner = <InputScreen />
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900/50 text-[14px] text-contrast">
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
