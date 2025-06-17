import { useBackendState } from '../../shared/ipc'
import { ActiveGoalWidget } from './ActiveGoalWidget'
import { ConfirmGoalWidget } from './ConfirmGoalWidget'
import { GoalInputWidget } from './GoalInputWidget'

export default function App() {
  const { state } = useBackendState()

  let inner
  if (!state) {
    return <div className="flex flex-col bg-white h-screen">Loading</div>
  } else if (state.session && state.session.confirmContinue) {
    inner = <ConfirmGoalWidget />
  } else if (state.session) {
    inner = <ActiveGoalWidget />
  } else {
    inner = <GoalInputWidget />
  }

  return <div className="flex flex-col bg-white h-screen">{inner}</div>
}
