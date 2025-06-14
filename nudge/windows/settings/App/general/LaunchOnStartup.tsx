import { useState } from 'react'
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
    <Fieldset>
      <LabelStack>
        <Label>Launch on startup</Label>
        <Description>Automatically start Nudge when you log in.</Description>
      </LabelStack>
      <input
        className="mt-1 w-4 h-4"
        type="checkbox"
        id="auto-launch"
        checked={autoLaunch}
        onChange={handleAutoLaunchChange}
      />
    </Fieldset>
  )
}
