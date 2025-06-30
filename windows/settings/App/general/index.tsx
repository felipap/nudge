import { withBoundary } from '../../../shared/ui/withBoundary'
import { NeedHelpFooter } from '../screen'
import { Hr, SectionWithHeader } from '../ui'
import { FrequencyInput } from './FrequencyInput'
import { LaunchOnStartup } from './LaunchOnStartup'
import { ModelFieldGroup } from './ModelFieldGroup'

export const General = withBoundary(() => {
  return (
    <main className="flex flex-col justify-between h-full p-4 text-[13px] w-full">
      {/* <About />z */}
      <div className="flex flex-col gap-4">
        <SectionWithHeader
          title="Model Selection"
          subtitle="Nudge only supports OpenAI's 4o model today."
        >
          <ModelFieldGroup />
        </SectionWithHeader>
        <Hr />
        <section>
          <FrequencyInput />
        </section>
        <Hr />
        <section>
          <LaunchOnStartup />
        </section>
      </div>
      <div className="flex-1"></div>
      <div>
        <NeedHelpFooter />
      </div>
    </main>
  )
})

function About() {
  return (
    <section className="flex flex-col gap-1 items-start">
      <header className="mb-2 flex flex-col gap-0.5">
        <div className="flex flex-row items-center">
          <h2 className="text-[18px] font-medium text-black">Nudge</h2>
        </div>

        <p className="">AI that nudges you to stay focused.</p>

        <p>
          By{' '}
          <button
            onClick={() =>
              window.electronAPI.openExternal('https://pi.engineering')
            }
            className="text-[#08c]"
          >
            pi.engineering
          </button>
        </p>
      </header>

      <div className="flex flex-row gap-2 items-center justify-between">
        <p>Version 1.0</p>
        <button
          onClick={() =>
            window.electronAPI.openExternal('https://github.com/fiberinc/nudge')
          }
          className="text-[#08c] "
        >
          GitHub repo
        </button>
      </div>
    </section>
  )
}
