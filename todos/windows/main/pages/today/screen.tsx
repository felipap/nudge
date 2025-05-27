import { useMemo } from 'react'
import { FaMoon, FaStar } from 'react-icons/fa6'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { Layout } from '../../components/Layout'
import { TaskList } from '../../components/TaskList'

export default function Screen() {
  const { tasks, addTodo } = useTodoState()

  const tonightTasks = useMemo(() => {
    return tasks.filter((t) => t.when === 'tonight' && !t.loggedAt)
  }, [tasks])

  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.when === 'today' && !t.loggedAt)
  }, [tasks])

  function handleAddTodo() {
    addTodo({ when: 'today' })
  }

  return (
    <Layout
      icon={<FaStar className="w-5 text-amber-300" />}
      title="Today"
      page="today"
      handleAddTodo={handleAddTodo}
    >
      <TaskList tasks={todayTasks} />
      <div className="flex items-center gap-2">
        <FaMoon className="w-5 text-blue-300" />
        <h1 className="text-[17px] font-semibold">Evening</h1>
      </div>
      <TaskList tasks={tonightTasks} />
    </Layout>
  )
}
