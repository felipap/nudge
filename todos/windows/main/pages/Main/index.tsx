import { PlusIcon } from 'lucide-react'
import { useMemo } from 'react'
import { Task } from '../../../../src/store/types'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { TaskList } from './TaskList'

export type Page =
  | 'completed'
  | 'anytime'
  | 'today'
  | 'trash'
  | 'someday'
  | 'project'

interface Props {
  title: string
  icon?: React.ReactNode
  page: Page
  projectId?: string
  filter: (task: Task) => boolean
}

export function Main({ title, filter, icon, page, projectId }: Props) {
  const { addTodo, tasks } = useTodoState()

  const pageTasks = useMemo(() => {
    return tasks.filter(filter)
  }, [tasks, filter])

  const handleAddTodo = () => {
    if (page === 'project') {
      if (!projectId) {
        throw new Error('projectId is required')
      }
      addTodo({ projectId })
    } else if (page === 'today') {
      addTodo({ when: 'today' })
    } else if (page === 'anytime') {
      addTodo({ when: 'anytime' })
    } else if (page === 'completed') {
      addTodo({ completedAt: new Date().toISOString() })
    } else if (page === 'trash') {
      addTodo({ deletedAt: new Date().toISOString() })
    } else if (page === 'someday') {
      addTodo({ when: null })
    }
  }

  return (
    <div className="px-10 pt-[50px] w-full h-full">
      <header className="flex pb-8 items-center justify-between">
        <PageTitle title={title} icon={icon} />
      </header>
      <main className="h-full overflow-hidden">
        <TaskList
          tasks={pageTasks}
          isToday={page === 'today'}
          onAddTodo={handleAddTodo}
          showStarIfToday={page !== 'today'}
        />
      </main>
      {/* Floating Action Button */}
      <div className="fixed bottom-3 right-3">
        <AddTodoButton onClick={handleAddTodo} />
      </div>
    </div>
  )
}

function PageTitle({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <h1 className="text-2xl font-semibold flex items-center gap-4">
      {icon}
      {title}
    </h1>
  )
}

function AddTodoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-colors"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  )
}
