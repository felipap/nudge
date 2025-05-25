import { useEffect, useState } from 'react'

export const FrequencyInput = () => {
  const [frequency, setFrequency] = useState<number>(1)

  useEffect(() => {
    const loadState = async () => {
      const state = await window.electronAPI.getState()
      setFrequency(state.captureFrequency)
    }
    loadState()
  }, [])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (!isNaN(value)) {
      setFrequency(value)
      // Update system setting via IPC
      window.electronAPI.setCaptureFrequency(value)
    }
  }

  return (
    <label
      htmlFor="frequency"
      className="flex flex-row gap-1 justify-between items-start pr-1"
    >
      <div className="flex flex-col">
        <span className="text-black">Capture frequency (seconds)</span>
        <p>How often to capture your screen.</p>
      </div>
      <input
        className="mt-1 w-16 rounded-md text-black text-sm px-1.5 h-8 border border-gray-300"
        type="number"
        id="frequency"
        value={frequency}
        onChange={onChange}
        min="15"
        max="300"
      />
    </label>
  )
}
