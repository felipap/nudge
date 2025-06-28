import { useEffect, useState } from 'react'
import { Capture } from '../../../../src/store/types'

export function CaptureTimeline() {
  const [captures, setCaptures] = useState<Capture[]>([])

  useEffect(() => {
    const fetchCaptures = async () => {
      const state = await window.electronAPI.getState()
      setCaptures(state.savedCaptures)
    }
    fetchCaptures()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">Capture Timeline</h2>
      </header>
      <main>
        {captures.map((capture) => (
          <div key={capture.at} className="text-sm">
            {capture.at} - {capture.summary}
          </div>
        ))}
        {captures.length === 0 && (
          <div className="text-gray-500">No captures saved</div>
        )}
      </main>
    </div>
  )
}
