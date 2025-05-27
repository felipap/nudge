import { useMemo } from 'react'
import { RiArchive2Fill } from 'react-icons/ri'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { Layout } from '../../components/Layout'
import { TaskList } from '../../components/TaskList'

export default function Screen() {
  const { tasks, addTodo } = useTodoState()

  const somedayTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.when === 'someday' && !t.loggedAt && !t.deletedAt
    )
  }, [tasks])

  function handleAddTodo() {
    addTodo({ when: 'today' })
  }

  return (
    <Layout
      icon={<RiArchive2Fill className="w-4.5 text-yellow-900/60" />}
      title="Someday"
      page="someday"
      handleAddTodo={handleAddTodo}
    >
      <TaskList tasks={somedayTasks} />
    </Layout>
  )
}
