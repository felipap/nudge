import { ApiKeyInput } from './ApiKeyInput'
import { FrequencyInput } from './FrequencyInput'
import { LaunchOnStartup } from './LaunchOnStartup'

export default function App() {
  return (
    <div className="flex flex-col pb-4 bg-[#f0efee] min-h-screen text-[13px] font-[SF+Pro] text-[#888]">
      <main className="p-4 h-full flex flex-col gap-4">
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
                window.electronAPI.openExternal(
                  'https://github.com/fiberinc/nudge'
                )
              }
              className="text-[#08c] "
            >
              GitHub repo
            </button>
          </div>
        </section>
        <hr />
        <section>
          <FrequencyInput />
        </section>
        <hr />
        <section>
          <LaunchOnStartup />
        </section>
        <hr />
        <section>
          <ApiKeyInput />
        </section>
      </main>
    </div>
  )
}
