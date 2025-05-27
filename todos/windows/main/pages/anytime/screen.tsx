import { ListIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { Layout } from '../../components/Main'
import { TaskList } from '../../components/Main/TaskList'

export default function Screen() {
  const { tasks, addTodo } = useTodoState()

  const somedayTasks = useMemo(() => {
    return tasks.filter((t) => t.when !== 'someday' && !t.loggedAt)
  }, [tasks])

  function handleAddTodo() {
    addTodo({ when: 'today' })
  }

  return (
    <Layout
      icon={<ListIcon className="w-5" />}
      title="Anytime"
      page="anytime"
      handleAddTodo={handleAddTodo}
    >
      <TaskList tasks={somedayTasks} />
    </Layout>
  )
}
