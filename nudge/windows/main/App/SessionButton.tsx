import { Pause, Play } from 'lucide-react'
import { useState } from 'react'

type SessionState = 'active' | 'paused' | 'idle'

interface SessionButtonProps {
  sessionTime?: number
  initialState?: SessionState
  onStateChange?: (state: SessionState) => void
}

export function SessionButton({
  sessionTime = 53,
  initialState = 'active',
  onStateChange,
}: SessionButtonProps) {
  const [sessionState, setSessionState] = useState<SessionState>(initialState)
  const [showPauseButton, setShowPauseButton] = useState(false)

  const handleClick = () => {
    if (sessionState === 'idle') {
      setSessionState('active')
      setShowPauseButton(true)
      onStateChange?.('active')
    } else if (sessionState === 'active') {
      if (showPauseButton) {
        setSessionState('paused')
        setShowPauseButton(false)
        onStateChange?.('paused')
      } else {
        setShowPauseButton(true)
      }
    } else if (sessionState === 'paused') {
      setSessionState('active')
      setShowPauseButton(false)
      onStateChange?.('active')
    }
  }

  // Active timer display (blue background)
  if (sessionState === 'active' && !showPauseButton) {
    return (
      <button
        className="flex flex-row items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-150 transition-colors"
        onClick={handleClick}
      >
        <div className="text-sm font-medium">{sessionTime} min</div>
      </button>
    )
  }

  // Pause button (blue background with pause icon)
  if (sessionState === 'active' && showPauseButton) {
    return (
      <button
        className="flex flex-row items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-150 transition-colors"
        onClick={handleClick}
      >
        <Pause className="w-3 h-3" />
        <div className="text-sm font-medium">Pause</div>
      </button>
    )
  }

  // Resume button (green background with play icon)
  if (sessionState === 'paused' && !showPauseButton) {
    return (
      <button
        className="flex flex-row items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-150 transition-colors"
        onClick={() => {
          setSessionState('active')
          setShowPauseButton(false)
          onStateChange?.('active')
        }}
      >
        <Play className="w-3 h-3" />
        <div className="text-sm font-medium">Resume</div>
      </button>
    )
  }

  // Paused state with time (gray background with pause icon)
  return (
    <button
      className="flex flex-row items-center gap-2 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-150 transition-colors"
      onClick={handleClick}
    >
      <Pause className="w-3 h-3" />
      <div className="text-sm font-medium">{sessionTime} min</div>
    </button>
  )
}
