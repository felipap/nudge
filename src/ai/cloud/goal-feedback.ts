import { z } from 'zod'
import { captureException, debug, log, warn } from '../../lib/logger'
import { GoalFeedbackResult } from '../goal-feedback'
import { callNudgeAPI } from './api'

// Keep in sync with nudge-web/app/api/goal-feedback/route.ts
const NudgeCloudGoalFeedbackStruct = z.object({
  activityDurationMins: z.number().nullable(),
  reasoning: z.string(),
  feedbackType: z.enum(['lacking-duration', 'unclear-apps']).nullable(),
})

// type NudgeCloudGoalFeedback = z.infer<typeof NudgeCloudGoalFeedbackStruct>

export async function getGoalFeedbackFromNudgeAPI(
  goal: string
): Promise<GoalFeedbackResult> {
  debug('[ai/cloud/goal-feedback] calling API')

  const result = await callNudgeAPI('/goal-feedback', {
    goal,
  })

  if ('error' in result) {
    warn('[ai/cloud/goal-feedback] error from API', result)
    return result
  }

  log('[ai/cloud/goal-feedback] result from API', result)

  // We'll try to fail gracefully.
  const parsed = NudgeCloudGoalFeedbackStruct.safeParse(result.data)
  if (!parsed.success) {
    warn('[ai/cloud/goal-feedback] failed to parse result', {
      result,
      error: parsed.error,
    })
    captureException(parsed.error)
  }

  return {
    data: {
      impliedDuration: (result.data as any).activityDurationMins,
      feedbackType: (result.data as any).feedbackType,
      isGood: !(result.data as any).feedbackType,
      feedback: (result.data as any).reasoning,
    },
  }
}
