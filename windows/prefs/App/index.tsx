import { ApiKeyInput } from './ApiKeyInput'
import { GoalInput } from './GoalInput'
import { LaunchAtStartupToggle } from './SettingsPanel'

export default function App() {
  return (
    <div className="p-4 flex flex-col gap-6 w">
      <header>
        <div className="text-xl font-semibold">Nudge Preferences</div>
      </header>

      <section>
        <LaunchAtStartupToggle />
      </section>

      <section>
        <GoalInput />
      </section>

      <section>
        <ApiKeyInput />
      </section>
    </div>
  )
}
