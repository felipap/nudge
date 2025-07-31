import OpenAI from 'openai'
import { debug } from '../lib/logger'
import { getGoalFeedbackFromNudgeAPI } from './cloud/goal-feedback'
import { getGoalFeedbackFromGemini } from './gemini/goal-feedback'
import { BackendClient } from './models'
import { getGoalFeedbackFromOpenAI } from './openai/goal-feedback'
import { Result } from './openai/utils'

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
  debug('[ai/goal-feedback] provider', client.provider)

  if (client.provider === 'nudge') {
    return await getGoalFeedbackFromNudgeAPI(goal)
  }

  if (client.provider === 'gemini') {
    const proxyClient = new OpenAI({
      apiKey: client.key,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })

    const gem = await getGoalFeedbackFromGemini(proxyClient, goal)
    console.log('gem', gem)
    return gem
  }

  return await getGoalFeedbackFromOpenAI(client.openAiClient, goal)
}
