import { useState } from 'react'

export function LaunchAtStartupToggle() {
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
    <label htmlFor="auto-launch" className="flex flex-row items-center">
      <input
        type="checkbox"
        id="auto-launch"
        checked={autoLaunch}
        onChange={handleAutoLaunchChange}
      />
      <span className="ml-2">Launch on startup</span>
    </label>
  )
}
