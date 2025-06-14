import { Hr, SectionWithHeader } from '../ui'
import { FrequencyInput } from './FrequencyInput'
import { LaunchOnStartup } from './LaunchOnStartup'
import { ModelFieldGroup } from './ModelFieldGroup'

export function General() {
  return (
    <main className="p-4 pb-10 flex flex-col gap-5 text-[13px] w-full">
      {/* <About />z */}
      <SectionWithHeader
        title="Model Selection"
        subtitle="Nudge works best with OpenAI's 4o but you can choose to use other models for unknown reasons."
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
      <Hr />
      <div className="h-[40px] w-full bg-red-500" />
    </main>
  )
}

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
