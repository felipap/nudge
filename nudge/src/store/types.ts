import { AvailableModel } from '../../windows/shared/available-models'

export const USER_TZ = 'America/Los_Angeles' // FIXME

// export type IPCResponse<T> = {
//   data: T
//   error: string | null
// }

export interface Capture {
  summary: string
  at: string
  isPositive: boolean
}

export interface ModelSelection {
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

export interface ActiveSession {
  content: string
  contentUpdatedAt: string | null
  //
  startedAt: string
  endedAt: string | null
  // Set to true to show the confirmation widget.
  confirmContinue?: boolean
  // Never set `pausedAt` or `resumedAt` at the same time.
  resumedAt: string | null
  pausedAt: string | null
  ellapsedBeforePausedMs: number
  //
  goalDurationMs: number
}

export interface State {
  // The latest capture, which must be relevant for the current goal. Set to
  // null when the user makes updates to the active goal, or clears it entirely.
  activeCapture:
    | (Capture & {
        // Adding this here for the semantics. An `activeCapture` might be
        // expired without being cleared.
        expiresAt: string
      })
    | null
  nextCaptureAt: string | null
  savedCaptures: Capture[]
  session: ActiveSession | null
  // capture state
  isCapturing: boolean
  isAssessing: boolean
  lastClosedAt: string | null
  // settings
  modelSelection: ModelSelection
  captureEverySeconds: number
  isWindowPinned: boolean
  autoLaunch: boolean
  // frontend things
  savedGoalInputValue: string | null
}

export const DEFAULT_STATE: State = {
  nextCaptureAt: null,
  session: null,
  savedCaptures: [],
  activeCapture: null,
  // capture state
  isCapturing: false,
  isAssessing: false,
  lastClosedAt: null,
  // settings
  modelSelection: {
    name: 'openai-4o',
    key: null,
    validatedAt: null,
  },
  captureEverySeconds: 60,
  isWindowPinned: false,
  autoLaunch: false,
  // frontend things
  savedGoalInputValue: null,
}
