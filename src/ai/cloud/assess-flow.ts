import { z } from 'zod'
import { callNudgeAPI } from '../../lib/api'
import { captureException, log, warn } from '../../lib/logger'
import { CaptureAssessmentResult } from '../assess-flow'

// Keep in sync with nudge-web/app/api/assess-flow/route.ts
const ResponseStruct = z.object({
  screenSummary: z.string(),
  messageToUser: z.string(),
  isFollowingGoals: z.boolean(),
  goalUnclear: z.boolean(),
})

export async function assessFlowFromNudgeAPI(
  imageBase64: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<CaptureAssessmentResult> {
  const result = await callNudgeAPI('/assess-flow', {
    goal,
    customInstructions,
    imageBase64,
    previousCaptures,
  })

  if ('error' in result) {
    warn('[ai/cloud/assess-flow] error from API', result)
    return result
  }

  log('[ai/cloud/assess-flow] result', result)

  const parsed = ResponseStruct.safeParse(result.data)
  if (!parsed.success) {
    warn('[ai/cloud/assess-flow] failed to parse result', {
      result,
      error: parsed.error,
    })
    captureException(parsed.error)

    // QUESTION is there a point in trying to ignore the error? (for backward
    // compatibility etc?)
  }

  return {
    data: {
      screenSummary: (result.data as any).screenSummary,
      messageToUser: (result.data as any).messageToUser,
      isFollowingGoals: (result.data as any).isFollowingGoals,
      goalUnclear: (result.data as any).goalUnclear,
    },
  }
}
