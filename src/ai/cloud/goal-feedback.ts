import { z } from 'zod'
import { callNudgeAPI } from '../../lib/api'
import { captureException, debug, log, warn } from '../../lib/logger'
import { GoalFeedbackResult } from '../goal-feedback'

// Keep in sync with nudge-web/app/api/goal-feedback/route.ts
const ResponseStruct = z.object({
  activityDurationMins: z.number().nullable(),
  reasoning: z.string(),
  feedbackType: z.enum(['lacking-duration', 'unclear-apps']).nullable(),
})

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

  const parsed = ResponseStruct.safeParse(result.data)
  if (!parsed.success) {
    warn('[ai/cloud/goal-feedback] failed to parse result', {
      result,
      error: parsed.error,
    })
    captureException(parsed.error)

    // QUESTION is there a point in trying to ignore the error? (for backward
    // compatibility etc?)
  }

  return {
    data: {
      activityDurationMins: (result.data as any).activityDurationMins,
      feedbackType: (result.data as any).feedbackType,
      reasoning: (result.data as any).reasoning,
    },
  }
}
