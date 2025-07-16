import { useEffect, useState } from 'react'
import { setPartialState, useBackendState } from '../../../shared/ipc'
import { NumberInputWithUnit } from '../../../shared/ui/native/NumberInputWithUnit'
import { Description, Label, LabelStack } from '../ui'

export const DoubleNudgeInput = () => {
  const { state } = useBackendState()
  const [value, setValue] = useState<number>(1)

  useEffect(() => {
    if (state) {
      setValue(state.doubleNudgeThresholdMins)
    }
  }, [state])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10)
    if (!isNaN(value)) {
      setValue(value)
      // Update system setting via IPC
      setPartialState({ doubleNudgeThresholdMins: value })
    }
  }

  return (
    <fieldset className="flex flex-row gap-2 items-center justify-between">
      <LabelStack>
        <Label>Cooldown period</Label>
        <Description>How long to wait before nudging you again.</Description>
      </LabelStack>
      <NumberInputWithUnit
        value={value}
        onChange={onChange}
        min={1}
        max={20}
        unit={`minute${value === 1 ? '' : 's'}`}
        className="mt-1 w-[120px] rounded-md text-contrast text-sm px-1.5 h-8 border-0 shadow-sm bg-btn"
      />
    </fieldset>
  )
}
