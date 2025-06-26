import { useEffect } from 'react'
import { openSettings, useBackendState } from '../../shared/ipc'
import { ActiveGoalWidget } from './ActiveGoalWidget'
import { ConfirmGoalWidget } from './ConfirmGoalWidget'
import { InputWidget } from './InputWidget'

export default function App() {
  const { state } = useBackendState()
  useGlobalShortcuts()

  let inner
  if (!state) {
    return <div className="flex flex-col bg-white h-screen">Loading</div>
  } else if (state.session && state.session.confirmContinue) {
    inner = <ConfirmGoalWidget />
  } else if (state.session) {
    inner = <ActiveGoalWidget />
  } else {
    inner = <InputWidget />
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900/50">
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
