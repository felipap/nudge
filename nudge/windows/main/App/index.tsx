import { useBackendState } from '../../shared/ipc'
import { ActiveGoalWidget } from './ActiveGoalWidget'
import { GoalInputWidget } from './GoalInputWidget'

export default function App() {
  const { state } = useBackendState()

  let inner
  if (!state) {
    return <div className="flex flex-col bg-white h-screen">Loading</div>
  } else if (state.activeGoal) {
    inner = <ActiveGoalWidget />
  } else {
    inner = <GoalInputWidget />
  }

  return <div className="flex flex-col bg-white h-screen">{inner}</div>
}
