import { PinIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useBackendState } from '../../../shared/ipc'
import { Nav } from '../../../shared/ui/Nav'
import { GoalTextarea } from '../GoalTextarea'
import { SessionButton } from '../SessionButton'

export function ActiveGoalWidget() {
  return (
    <div className="flex flex-col bg-white h-screen ">
      <Nav title="Focus session until 4pm" />
      <main className="h-full flex flex-col shadow-inset-bottom">
        <GoalTextarea />
        {/* <TryNowButton /> */}
      </main>
      <footer className="p-2 flex flex-row items-center justify-between z-10">
        <SessionButton />
        <PinButton />
      </footer>
    </div>
  )
}

function PinButton() {
  const { state } = useBackendState()

  async function togglePin() {
    if (state) {
      await window.electronAPI.setPartialState({
        isGoalWindowPinned: !state.isGoalWindowPinned,
      })
    }
  }

  const isPinned = state?.isGoalWindowPinned ?? false

  return (
    <button
      className={twMerge(
        'w-6 h-6 pt-[2px] flex items-center justify-center rounded-full !cursor-pointer',
        isPinned &&
          'bg-blue-200/30 text-blue-600 hover:bg-blue-200/50 transition-all border-blue-600/20 border'
      )}
      onClick={togglePin}
    >
      <PinIcon className="w-4 h-4" />
    </button>
  )
}
