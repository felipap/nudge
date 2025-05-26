import { useMemo } from 'react'
import { BsFillTrash2Fill } from 'react-icons/bs'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { Button } from '../../../shared/ui/Button'
import { Layout } from '../../components/Main'
import { TaskList } from '../../components/Main/TaskList'

export default function Screen() {
  const { tasks, clearTrash } = useTodoState()

  const pageTasks = useMemo(() => {
    return tasks.filter((t) => !!t.deletedAt)
  }, [tasks])

  return (
    <Layout
      icon={<BsFillTrash2Fill className="w-5 text-gray-400" />}
      title="Trash"
      page="trash"
    >
      <Button className="self-start mb-4" onClick={clearTrash}>
        Clear Trash
      </Button>
      <TaskList tasks={pageTasks} showStarIfToday restoreOnDelete />
    </Layout>
  )
}
