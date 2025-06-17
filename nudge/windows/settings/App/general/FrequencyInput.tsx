import { useEffect, useState } from 'react'
import { Description, Label, LabelStack } from '../ui'

export const FrequencyInput = () => {
  const [frequency, setFrequency] = useState<number>(1)

  useEffect(() => {
    const loadState = async () => {
      const state = await window.electronAPI.getState()
      setFrequency(state.captureEverySeconds)
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
    <fieldset className="flex flex-row gap-2 items-center justify-between">
      <LabelStack>
        <Label>Capture frequency (seconds)</Label>
        <Description>
          How often to capture your screen to assess your focus.
        </Description>
      </LabelStack>
      <input
        className="mt-1 w-[120px] rounded-md text-black text-sm px-1.5 h-8 border border-gray-300"
        type="number"
        id="frequency"
        value={frequency}
        onChange={onChange}
        min="60"
        // prefix="seconds"
        max="300"
      />
    </fieldset>
  )
}
