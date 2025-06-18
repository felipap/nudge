import { useState } from 'react'
import { Checkbox } from '../../../shared/ui/native/Checkbox'
import { Description, Fieldset, Label, LabelStack } from '../ui'

export function LaunchOnStartup() {
  const [autoLaunch, setAutoLaunch] = useState<boolean>(true)

  const handleAutoLaunchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked
    setAutoLaunch(isChecked)

    // Update system setting via IPC
    window.electronAPI.setAutoLaunch(isChecked)
  }

  return (
    <Fieldset className="justify-cesnter ml-6 flex">
      <div className="flex flex-row gap-2 items-start justify-start">
        <Checkbox
          id="auto-launch"
          className="mt-1"
          // label="Launch on startup"
          checked={autoLaunch}
          onChange={handleAutoLaunchChange}
        />
        <LabelStack htmlFor="auto-launch  ">
          <Label>Launch on startup</Label>
          <Description>Automatically start Nudge when you log in.</Description>
        </LabelStack>
      </div>
    </Fieldset>
  )
}
