import { z } from 'zod'
import { ModelError } from '../../../../windows/shared/shared-types'
import { log } from '../../logger'
import { BackendClient } from '../models'
import { getGoalFeedbackFromOpenAI } from './direct'
import { getGoalFeedbackFromNudgeAPI } from './hosted'

export const GoalFeedbackStruct = z.object({
  isGood: z.boolean(),
  impliedDuration: z.number().nullable(),
  feedback: z.string(),
  feedbackType: z.enum(['lacking-duration', 'unclear-apps', 'none']).nullable(),

  // isPositive: z.boolean(),
  // feedbackType: z.enum(['lacking-duration', 'unclear-apps', 'none']).nullable(),
  // impliedDuration: z
  //   .number()
  //   .nullable()
  //   .describe(
  //     'The implied duration of the activity in minutes. If not specified, return null.'
  //   ),
  // feedback: z.string().describe('The feedback to the user.'),
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
