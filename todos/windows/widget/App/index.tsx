import { PinIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { useBackendState } from '../../shared/ipc'
import { useTodoState } from '../../shared/lib/useTodoState'
import { TaskList } from '../../shared/ui/TaskList'
import { PlusIcon } from './PlusIcon'

export default function App() {
  const { tasks, addTodo } = useTodoState()

  return (
    <div className="flex flex-col h-screen bg-white relative overflow-hidden">
      <header className="flex items-center justify-between px-3 pt-3 pb-1">
        <h2 className="text-[17px] pt-1 font-semibold w-full [app-region:drag]">
          Todos
        </h2>
        <div>
          <PinButton />
        </div>
      </header>
      <main className="h-full overflow-hidden px-2">
        <TaskList tasks={tasks} />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-3 right-3">
        <AddTodoButton onClick={() => addTodo('')} />
      </div>
    </div>
  )
}

function PinButton() {
  const { state } = useBackendState()

  async function togglePin() {
    if (state) {
      await window.electronAPI.setPartialState({
        iswidgetWindowPinned: !state.iswidgetWindowPinned,
      })
    }
  }

  const isPinned = state?.iswidgetWindowPinned ?? false

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

function AddTodoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-9 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center"
    >
      <PlusIcon className="w-5 h-5" />
    </button>
  )
}
