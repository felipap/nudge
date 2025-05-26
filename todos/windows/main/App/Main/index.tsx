import { PlusIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useBackendState } from '../../../shared/ipc'
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
  page: Page
  projectId?: string
}

export function Main({ page, projectId }: Props) {
  const { tasks, addTodo } = useTodoState()
  const { state } = useBackendState()
  const projects = state?.projects ?? []

  let title = ''
  if (page === 'today') {
    title = 'Today'
  } else if (page === 'anytime') {
    title = 'All'
  } else if (page === 'completed') {
    title = 'Completed'
  } else if (page === 'trash') {
    title = 'Trash'
  } else if (page === 'someday') {
    title = 'Someday'
  } else if (page === 'project') {
    const project = projects.find((p) => p.id === projectId)
    title = project?.title ?? 'Project'
  } else {
    page satisfies never
  }

  const pageTasks = useMemo(() => {
    if (page === 'anytime') {
      return tasks.filter((task) => !task.projectId && !task.deletedAt)
    }
    if (page === 'someday') {
      return tasks.filter((task) => !task.deletedAt)
    }
    if (page === 'trash') {
      return tasks.filter((task) => task.deletedAt)
    }
    if (page === 'completed') {
      return tasks.filter((task) => task.completedAt && !task.deletedAt)
    }
    if (page === 'project' && projectId) {
      return tasks.filter(
        (task) => task.projectId === projectId && !task.deletedAt
      )
    }
    return tasks.filter((task) => !task.deletedAt)
  }, [page, tasks, projectId])

  const handleAddTodo = () => {
    if (page === 'project' && projectId) {
      addTodo('', projectId)
    } else {
      addTodo('')
    }
  }

  return (
    <div className="px-10 pt-[50px] w-full h-full">
      <header className="flex pb-8 items-center justify-between">
        <PageTitle title={title} />
      </header>
      <main className="h-full overflow-hidden">
        <TaskList tasks={pageTasks} />
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-3 right-3">
        <AddTodoButton onClick={handleAddTodo} />
      </div>
    </div>
  )
}

function PageTitle({ title }: { title: string }) {
  return <h1 className="text-2xl font-bold">{title}</h1>
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
