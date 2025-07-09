import assert from 'assert'
import { z } from 'zod'
import { ModelError } from '../../../../windows/shared/shared-types'
import { log } from '../../logger'
import { BackendClient } from '../models'
import { assessFlowFromOpenAI } from './direct'
import { assessFlowFromNudgeAPI } from './hosted'

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
  log('client.provider', client.provider)

  assert(goal, 'goal is required')

  if (client.provider === 'nudge') {
    return await assessFlowFromNudgeAPI(
      base64content,
      goal,
      customInstructions,
      previousCaptures
    )
  }

  return await assessFlowFromOpenAI(
    client,
    base64content,
    goal,
    customInstructions,
    previousCaptures
  )
}
