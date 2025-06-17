import { useBackendState } from '../../shared/ipc'
import { ActiveGoalWidget } from './ActiveGoalWidget'
import { ConfirmGoalWidget } from './ConfirmGoalWidget'
import { InputWidget } from './InputWidget'

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
    inner = <InputWidget />
  }

  return <div className="flex flex-col bg-white h-screen">{inner}</div>
}
