import { AvailableModel } from '../../windows/shared/available-models'

export interface Capture {
  summary: string
  at: string
  inFlow: boolean
  impossibleToAssess: boolean
}

export interface ModelSelection {
  name: AvailableModel
  key: string | null
  validatedAt: string | null
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
  elapsedBeforePausedMs: number
  //
  goalDurationMs: number
  //
  notifiedAboutOvertime?: boolean
}

export interface State {
  // The latest capture, which must be relevant for the current goal. Set to
  // null when the user makes updates to the active goal, or clears it entirely.
  activeCapture:
    | (Capture & {
        // Adding this here for the semantics. An `activeCapture` might be
        // expired without being cleared.
        expiresAt: string
        impossibleToAssess: boolean
      })
    | null
  nextCaptureAt: string | null
  session: ActiveSession | null
  // capture state
  captureStartedAt: string | null // date
  assessStartedAt: string | null // date
  lastClosedAt: string | null
  // settings
  modelSelection: ModelSelection | null
  captureEverySeconds: number
  isWindowPinned: boolean
  // ⬇️ This can't live in the state because it's a system setting.
  // autoLaunch: boolean
  // frontend things
  savedGoalInputValue: string | null
  // history of captures
  savedCaptures: Capture[]
  customInstructions: string | null
}

export const DEFAULT_STATE: State = {
  nextCaptureAt: null,
  session: null,
  savedCaptures: [],
  activeCapture: null,
  // capture state
  captureStartedAt: null,
  assessStartedAt: null,
  lastClosedAt: null,
  // settings
  modelSelection: {
    name: 'openai-4o',
    key: null,
    validatedAt: null,
  },
  captureEverySeconds: 60,
  isWindowPinned: false,
  customInstructions: null,
  // frontend things
  savedGoalInputValue: null,
}
