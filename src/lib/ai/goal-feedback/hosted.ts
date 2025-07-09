import { log } from '../../logger'
import { callNudgeAPI } from '../../hosted/api'
import { GoalFeedbackResult } from './index'

export async function getGoalFeedbackFromNudgeAPI(
  goal: string
): Promise<GoalFeedbackResult> {
  const result = await callNudgeAPI('/goal-feedback', {
    goal,
  })

  log('[ai/goal-feedback] result', result)

  return result as GoalFeedbackResult
}
