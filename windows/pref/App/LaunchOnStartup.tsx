import { useState } from 'react'

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
    <label
      htmlFor="auto-launch"
      className="flex flex-row gap-1 justify-between items-center pr-3"
    >
      <div className="flex flex-col">
        <span className="text-black">Launch on startup</span>
        <p>Automatically start Nudge when you log in.</p>
      </div>
      <input
        className="mt-1 w-4 h-4"
        type="checkbox"
        id="auto-launch"
        checked={autoLaunch}
        onChange={handleAutoLaunchChange}
      />
    </label>
  )
}
