import { Button } from '../../../shared/ui/Button'
import { useMemo } from 'react'
import { FaBook } from 'react-icons/fa6'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { Layout } from '../../components/Main'
import { TaskList } from '../../components/Main/TaskList'

export default function Screen() {
  const { tasks, logAllCompleted } = useTodoState()

  const pageTasks = useMemo(() => {
    return tasks.filter((t) => !!t.loggedAt && !t.deletedAt)
  }, [tasks])

  return (
    <Layout
      icon={<FaBook className="w-5 text-green-500" />}
      title="Logbook"
      page="logbook"
    >
      <Button className="self-start mb-4" onClick={logAllCompleted}>
        Flush
      </Button>

      <TaskList tasks={pageTasks} showStarIfToday visibleItemDate />
    </Layout>
  )
}
