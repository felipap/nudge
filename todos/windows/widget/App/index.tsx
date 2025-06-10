import { PinIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { useBackendState } from '../../shared/ipc'
import { useTodoState } from '../../shared/lib/useTodoState'
import { PlusIcon } from './PlusIcon'
import { TaskList } from './TaskList'

export default function App() {
  const { addTodo } = useTodoState()
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasScrolled = useHasScrolled(scrollRef)

  return (
    <div className="flex flex-col h-screen bg-white relative overflow-hidden">
      <header
        className={twMerge(
          'flex items-center justify-between px-3 pt-3 pb-2 [app-region:drag] transition-all duration-100',
          hasScrolled && 'border-b border-gray-100'
        )}
      >
        <h2 className="text-[17px] pt-1 font-semibold w-full select-none">
          Todos
        </h2>
        <div className="[app-region:no-drag]">
          <PinButton />
        </div>
      </header>
      <main className="h-full overflow-scroll px-2 pt-2" ref={scrollRef}>
        <div className="pb-5">
          <TaskList />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-3 right-3">
        <AddTodoButton onClick={() => addTodo({ text: '' })} />
      </div>
    </div>
  )
}

function PinButton() {
  const { state } = useBackendState()

  async function togglePin() {
    if (state) {
      await window.electronAPI.setPartialState({
        isWidgetPinned: !state.isWidgetPinned,
      })
    }
  }

  const isPinned = state?.isWidgetPinned ?? false

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

function useHasScrolled(ref: React.RefObject<HTMLDivElement | null>) {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const handleScroll = () => {
      if (!ref.current) {
        return
      }

      setHasScrolled(ref.current.scrollTop > 0)
    }

    ref.current.addEventListener('scroll', handleScroll)
    return () => {
      if (!ref.current) {
        return
      }

      ref.current.removeEventListener('scroll', handleScroll)
    }
  }, [ref])

  return hasScrolled
}
