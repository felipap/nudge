import { useEffect, useState } from 'react'
import { useBackendState } from '../../../shared/ipc'

// Returns measures of time left and elapsed but not on every render.
export function useEfficientDurations() {
  const { state } = useBackendState()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
      // FIXME When time elapsed and time left are > 60s, there's no reason to
      // re-render so often.
    }, 1_000)
    return () => clearInterval(interval)
  }, [])

  const session = state?.session
  if (!session) {
    return {
      elapsedMs: 0,
      timeLeftMs: 0,
      isOvertime: false,
      isNearlyOver: false,
    }
  }

  // Calculate total time elapsed.
  let elapsedMs
  if (session.pausedAt) {
    elapsedMs = session.elapsedBeforePausedMs || 0
  } else {
    elapsedMs =
      (session.elapsedBeforePausedMs || 0) +
      (now.getTime() -
        new Date(session.resumedAt || session.startedAt).getTime())
  }

  const timeLeftMs = session.goalDurationMs - elapsedMs

  return {
    elapsedMs,
    timeLeftMs,
    isOvertime: timeLeftMs < 0,
    isNearlyOver: timeLeftMs < 60_000 && timeLeftMs >= 0,
  }
}

export function getLabelForTimeLeft(msLeft: number) {
  if (msLeft < -60 * 60 * 1_000) {
    return `${(-msLeft / 1000 / 60 / 60).toFixed(1)}h over`
  } else if (msLeft < -60_000) {
    return `${Math.floor(-msLeft / 1000 / 60)}m over`
  } else if (msLeft < -10_000) {
    return `${Math.floor(-msLeft / 1000)}s over`
  } else if (msLeft <= 0) {
    return "Time's up"
  } else if (msLeft < 60_000) {
    return `${Math.floor(msLeft / 1000)}s left`
  } else {
    return `${Math.floor(msLeft / 1000 / 60)}m left`
  }
}

export function formatDuration(ms: number) {
  if (ms < 60_000) {
    return `${Math.floor(ms / 1000)}s`
  } else if (ms < 60 * 60 * 1_000) {
    return `${Math.floor(ms / 1000 / 60)}m`
  } else {
    return `${(ms / 1000 / 60 / 60).toFixed(1)}h`
  }
}
