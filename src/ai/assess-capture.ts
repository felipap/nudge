import assert from 'assert'
import { debug } from '../lib/logger'
import { assessFlowFromNudgeAPI } from './cloud/assess-capture'
import { BackendClient } from './models'
import { Result } from './openai/utils'
import { assessFlowWithOpenAI } from './openai/assess-capture'

export type CaptureAssessment = {
  screenSummary: string
  notificationToUser: string
  isFollowingGoals: boolean
  goalUnclear: boolean
}

export type CaptureAssessmentResult = Result<CaptureAssessment>

export async function assessFlowFromScreenshot(
  client: BackendClient,
  base64content: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<CaptureAssessmentResult> {
  debug('client.provider', client.provider)

  assert(goal, 'goal is required')

  if (client.provider === 'nudge') {
    return await assessFlowFromNudgeAPI(
      base64content,
      goal,
      customInstructions,
      previousCaptures
    )
  }

  const openaiResult = await assessFlowWithOpenAI(
    client.openAiClient,
    base64content,
    goal,
    customInstructions,
    previousCaptures
  )

  if ('error' in openaiResult) {
    return openaiResult
  }

  return {
    data: {
      screenSummary: openaiResult.data.screenSummary,
      notificationToUser: openaiResult.data.notificationToUser,
      isFollowingGoals: openaiResult.data.isFollowingGoals,
      goalUnclear: openaiResult.data.goalUnclear,
    },
  }
}
