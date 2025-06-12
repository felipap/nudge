export const USER_TZ = 'America/Los_Angeles' // FIXME

export type IPCResponse<T> = {
  data: T
  error: string | null
}

export type Mood = 'happy' | 'angry' | 'thinking' | 'waiting'

export interface Capture {
  summary: string
  at: string
  isPositive: boolean
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export interface GoalSession {
  content: string
  startedAt: string
  updatedAt: string | null
  pausedAt: string | null
  endedAt: string | null
  minsLeft: number
}

export interface State {
  openAiKey: string | null
  lastCapture: Capture | null
  nextCaptureAt: string | null
  savedCaptures: Capture[]
  autoLaunch: boolean
  captureFrequency: number
  isGoalWindowPinned: boolean
  activeGoal: GoalSession | null
}
