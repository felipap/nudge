import { z } from 'zod'
import { ModelError } from '../../windows/shared/shared-types'
import { log } from '../lib/logger'
import { getGoalFeedbackFromNudgeAPI } from './cloud/goal-feedback'
import { BackendClient } from './models'
import { getGoalFeedbackFromOpenAI } from './openai/goal-feedback'

export const GoalFeedbackStruct = z.object({
  isGood: z.boolean(),
  impliedDuration: z.number().nullable(),
  feedback: z.string(),
  feedbackType: z.enum(['lacking-duration', 'unclear-apps', 'none']).nullable(),
})

export type GoalFeedback = z.infer<typeof GoalFeedbackStruct>

export type GoalFeedbackResult =
  | {
      data: GoalFeedback
    }
  | {
      error: ModelError
      message?: string
    }

export async function getGoalFeedback(
  client: BackendClient,
  goal: string
): Promise<GoalFeedbackResult> {
  log('client.provider', client.provider)

  if (client.provider === 'nudge') {
    return await getGoalFeedbackFromNudgeAPI(goal)
  }

  return await getGoalFeedbackFromOpenAI(client.openAiClient, goal)
}
