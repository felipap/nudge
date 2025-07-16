import { AvailableModel, ModelError } from '../../windows/shared/shared-types'
import { DOUBLE_NUDGE_THRESHOLD_MINS } from '../lib/config'

export interface Capture {
  summary: string
  at: string
  inFlow: boolean
  impossibleToAssess: boolean
  // Makes sense to put this here even though it's not exactly a property of the
  // capture.
  notificationToUser: string | null
}

export interface LatestCapture extends Capture {
  // Adding this here for the semantics. An `activeCapture` might be expired
  // without being cleared.
  expiresAt: string
  impossibleToAssess: boolean
}

export interface CaptureError {
  at: string
  modelError: ModelError
}

export type ModelSelection = {
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

export type State = {
  // The active capture, which must be relevant for the current goal. Set to
  // null when the user makes updates to the active goal, or clears it entirely.
  activeCapture: LatestCapture | CaptureError | null
  nextCaptureAt: string | null
  session: ActiveSession | null
  // capture state
  captureStartedAt: string | null // date
  assessStartedAt: string | null // date
  lastClosedAt: string | null
  // settings

  // When true, we'll ignore `modelSelection` and send screenshots to Nudge
  // server.
  useNudgeCloud: boolean
  modelSelection: ModelSelection | null
  captureEverySeconds: number
  doubleNudgeThresholdMins: number
  isWindowPinned: boolean
  // ⬇️ This can't live in the state because it's a system setting.
  // autoLaunch: boolean
  // frontend things
  savedGoalInputValue: string | null
  // history of captures
  savedCaptures: Capture[]
  customInstructions: string | null
  events?: {
    firstOpenedAt?: Date
    finishedOnboardingAt?: Date
  }
}

export const DEFAULT_STATE: State = {
  nextCaptureAt: null,
  session: null,
  savedCaptures: [],
  activeCapture: null,
  // capture state
  captureStartedAt: null,
  doubleNudgeThresholdMins: DOUBLE_NUDGE_THRESHOLD_MINS,
  assessStartedAt: null,
  lastClosedAt: null,
  // settings
  useNudgeCloud: false, // Important to start with false.
  modelSelection: null,
  captureEverySeconds: 60,
  isWindowPinned: false,
  customInstructions: null,
  // frontend things
  savedGoalInputValue: null,
}
