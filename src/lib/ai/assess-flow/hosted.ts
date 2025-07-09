import { log } from '../../logger'
import { callNudgeAPI } from '../../hosted/api'
import { AssessmentResult } from './index'

export async function assessFlowFromNudgeAPI(
  base64content: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<AssessmentResult> {
  const result = await callNudgeAPI('/assess', {
    goal,
    customInstructions,
    base64Image: base64content,
    previousCaptures,
  })

  log('[ai/assess-flow] result', result)

  return result as AssessmentResult
}
