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
    <label htmlFor="auto-launch" className="flex flex-row gap-1 items-start">
      <input
        className="mt-1 w-3.5 h-3.5"
        type="checkbox"
        id="auto-launch"
        checked={autoLaunch}
        onChange={handleAutoLaunchChange}
      />
      <div className="flex flex-col">
        <span className="ml-2 text-black">Launch on startup</span>
        <p className="ml-2">Automatically start Nudge when you log in.</p>
      </div>
    </label>
  )
}
