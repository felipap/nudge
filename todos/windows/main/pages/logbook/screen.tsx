import { useMemo } from 'react'
import { FaBook } from 'react-icons/fa6'
import { useTodoState } from '../../../shared/lib/useTodoState'
import { Button } from '../../../shared/ui/Button'
import { Layout } from '../../components/Layout'
import { TaskList } from '../../components/TaskList'

export default function Screen() {
  const { tasks, logAllCompleted } = useTodoState()

  const pageTasks = useMemo(() => {
    return tasks.filter((t) => !!t.loggedAt && !t.deletedAt)
  }, [tasks])

  const hasPendingToFlush = useMemo(() => {
    return tasks.some(
      (t) => (t.completedAt || t.cancelledAt) && !t.loggedAt && !t.deletedAt
    )
  }, [tasks])

  return (
    <Layout
      icon={<FaBook className="w-5 text-green-500" />}
      title="Logbook"
      page="logbook"
      backgroundIcon={
        pageTasks.length === 0 && (
          <FaBook className="w-20 h-20 text-green-500" />
        )
      }
    >
      {hasPendingToFlush && (
        <Button className="self-start mb-4" onClick={logAllCompleted}>
          Flush
        </Button>
      )}

      <TaskList tasks={pageTasks} showStarIfToday visibleItemDate />
    </Layout>
  )
}
