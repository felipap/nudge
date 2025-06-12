import { useBackendState } from '../../shared/ipc'
import { ActiveGoalWidget } from './ActiveGoalWidget'
import { GoalInputWidget } from './GoalInputWidget'

export default function App() {
  const { state } = useBackendState()

  if (state?.activeGoal) {
    return <ActiveGoalWidget />
  }

  return <GoalInputWidget />
}
