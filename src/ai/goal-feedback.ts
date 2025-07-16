import { log } from '../lib/logger'
import { getGoalFeedbackFromNudgeAPI } from './cloud/goal-feedback'
import { BackendClient } from './models'
import { Result } from './openai/utils'
import { getGoalFeedbackFromOpenAI } from './openai/goal-feedback'

export type GoalFeedback = {
  feedbackType: 'lacking-duration' | 'unclear-apps' | null
  activityDurationMins: number | null
  reasoning: string
}

export type GoalFeedbackResult = Result<GoalFeedback>

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
