import { useEffect, useState } from 'react'
import { setPartialState, useBackendState } from '../../../shared/ipc'
import { NumberInputWithUnit } from '../../../shared/ui/native/NumberInputWithUnit'
import { Description, Label, LabelStack } from '../ui'

export const FrequencyInput = () => {
  const [value, setValue] = useState<number>(1)
  const { state } = useBackendState()

  useEffect(() => {
    if (state) {
      setValue(state.captureEverySeconds)
    }
  }, [state])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (!isNaN(value)) {
      setValue(value)
      setPartialState({ captureEverySeconds: value })
    }
  }

  return (
    <fieldset className="flex flex-row gap-2 items-center justify-between">
      <LabelStack>
        <Label>Capture frequency</Label>
        <Description>
          How often to capture your screen to assess your focus.
        </Description>
      </LabelStack>
      <NumberInputWithUnit
        value={value}
        onChange={onChange}
        min={60}
        max={300}
        unit={`second${value === 1 ? '' : 's'}`}
        className="mt-1 w-[120px] rounded-md text-contrast text-sm pr-1.5 pl-3 h-8 border-0 shadow-sm bg-btn"
      />
    </fieldset>
  )
}
