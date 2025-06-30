import { useEffect, useState } from 'react'
import { getAutoLaunch, setAutoLaunch } from '../../../shared/ipc'
import { Checkbox } from '../../../shared/ui/native/Checkbox'
import { Description, Fieldset, Label, LabelStack } from '../ui'

export function LaunchOnStartup() {
  const [checked, setChecked] = useState<boolean>(true)

  useEffect(() => {
    async function load() {
      const isEnabled = await getAutoLaunch()
      setChecked(isEnabled)
    }
    load()
  }, [])

  const handleAutoLaunchChange = () => {
    setChecked(!checked)
    setAutoLaunch(!checked)
  }

  return (
    <Fieldset className="justify-cesnter ml-6 flex">
      <div
        className="flex flex-row gap-2 items-start justify-start cursor-pointer"
        onClick={handleAutoLaunchChange}
      >
        <Checkbox
          id="auto-launch"
          className="mt-1"
          // label="Launch on startup"
          checked={checked}
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
