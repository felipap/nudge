import { TaskList } from '../../../shared/ui/TaskList'
import { PlusIcon } from 'lucide-react'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { useMemo } from 'react'

export type Page = 'completed' | 'all' | 'today'

interface Props {
  page: Page
}

export function Main({ page }: Props) {
  const { tasks, addTodo } = useTodoState()

  const title =
    page === 'completed' ? 'Completed' : page === 'today' ? 'Today' : 'All'

  const pageTasks = useMemo(() => {
    if (page === 'all') {
      return tasks
    }
    // if (page === 'today') {
    //   return tasks.filter(
    //     (task) => task.dueDate === dayjs().format('YYYY-MM-DD')
    //   )
    // }
    if (page === 'completed') {
      return tasks.filter((task) => task.completedAt)
    }
  }, [page, tasks])

  return (
    <div className="px-10 pt-[50px] w-full h-full">
      <header className="flex pb-8 items-center justify-between">
        <h2 className="text-[27px] pt-1 font-semibold w-full [app-region:drag]">
          {title}
        </h2>
      </header>
      <main className="h-full overflow-hidden">
        <TaskList tasks={pageTasks} />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-3 right-3">
        <AddTodoButton onClick={() => addTodo('')} />
      </div>
    </div>
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
