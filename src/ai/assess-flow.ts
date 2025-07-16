import assert from 'assert'
import { z } from 'zod'
import { ModelError } from '../../windows/shared/shared-types'
import { debug } from '../lib/logger'
import { assessFlowFromNudgeAPI } from './cloud/assess-flow'
import { BackendClient } from './models'
import { assessFlowWithOpenAI } from './openai/assess-flow'

export const AssessmentStruct = z.object({
  screenSummary: z.string(),
  messageToUser: z.string(),
  isFollowingGoals: z.boolean(),
  goalUnclear: z
    .boolean()
    .describe(`Set to true when the goal is absolutely unclear.`),
})

export type Assessment = z.infer<typeof AssessmentStruct>

export type AssessmentResult =
  | {
      data: Assessment
    }
  | {
      error: ModelError
      message?: string
    }

export async function assessFlowFromScreenshot(
  client: BackendClient,
  base64content: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<AssessmentResult> {
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
      messageToUser: openaiResult.data.messageToUser,
      isFollowingGoals: openaiResult.data.isFollowingGoals,
      goalUnclear: openaiResult.data.goalUnclear,
    },
  }
}
