import assert from 'assert'
import OpenAI from 'openai'
import { debug } from '../lib/logger'
import { assessFlowFromNudgeAPI } from './cloud/assess-capture'
import { assessFlowWithGemini } from './gemini/assess-capture'
import { BackendClient } from './models'
import { assessFlowWithOpenAI } from './openai/assess-capture'
import { Result } from './openai/utils'

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

  let res
  if (client.provider === 'gemini') {
    const openai = new OpenAI({
      apiKey: client.key,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })

    res = await assessFlowWithGemini(
      openai,
      base64content,
      goal,
      customInstructions,
      previousCaptures
    )
  } else {
    res = await assessFlowWithOpenAI(
      client.openAiClient,
      base64content,
      goal,
      customInstructions,
      previousCaptures
    )
  }

  if ('error' in res) {
    return res
  }

  return {
    data: {
      screenSummary: res.data.screenSummary,
      notificationToUser: res.data.notificationToUser,
      isFollowingGoals: res.data.isFollowingGoals,
      goalUnclear: res.data.goalUnclear,
    },
  }
}
