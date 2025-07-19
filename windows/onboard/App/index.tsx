import { OnboardingScreen } from './OnboardingScren'
import { ModelTab } from './step2-model'
import { ScreenPermissions } from './step1-screen'

export default function App() {
  return (
    <div className="flex flex-col h-screen text-contrast">
      <div className="overflow-scroll bg-background h-full flex flex-col w-full select-none">
        <OnboardingScreen />
        <div className="w-full [app-region:drag]">
          <ModelTab />
          <ScreenPermissions />
        </div>
      </div>
    </div>
  )
}
