import { AvailableModel } from '../../windows/shared/available-models'

export const USER_TZ = 'America/Los_Angeles' // FIXME

// export type IPCResponse<T> = {
//   data: T
//   error: string | null
// }

export const DEFAULT_STATE: State = {
  openAiKey: null,
  nextCaptureAt: null,
  savedCaptures: [],
  activeGoal: null,
  captureFrequencySeconds: 1,
  isWindowPinned: false,
  autoLaunch: false,
  activeCapture: null,
  savedGoalInputValue: null,
  isCapturing: false,
  isAssessing: false,
  modelSelection: {
    name: 'openai-4o',
    key: null,
    validatedAt: null,
  },
}

export interface Capture {
  summary: string
  at: string
  isPositive: boolean
}

export interface ActiveModel {
  name: AvailableModel
  key: string | null
  validatedAt: string | null
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
  modelSelection: ActiveModel
  activeCapture:
    | (Capture & {
        // Adding this here for the semantics. An `activeCapture` might be
        // expired without being cleared.
        expiresAt: string
      })
    | null

  nextCaptureAt: string | null
  savedCaptures: Capture[]
  captureFrequencySeconds: number
  isWindowPinned: boolean
  activeGoal: GoalSession | null
  // Minor things
  savedGoalInputValue: string | null
  isCapturing: boolean
  isAssessing: boolean
  // Settings
  autoLaunch: boolean
}
