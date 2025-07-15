import { callNudgeAPI } from '../../lib/hosted/api'
import { log } from '../../lib/logger'
import { AssessmentResult } from '../assess-flow'

export async function assessFlowFromNudgeAPI(
  base64content: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<AssessmentResult> {
  const result = await callNudgeAPI('/assess-flow', {
    goal,
    customInstructions,
    base64Image: base64content,
    previousCaptures,
  })

  log('[ai/cloud/assess-flow] result', result)

  return result as AssessmentResult
}
