import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { SYSTEM_PROMPT } from '../../openai/goal-feedback'
import { log, warn } from '../../openai/oai-logger'
import { Result, safeOpenAIStructuredCompletion } from '../../openai/utils'
import { OpenAICompatibleGeminiClient } from '../utils'
import { GoalFeedback } from '../../goal-feedback'

// Gemini doesn't support enums, so we can't use the same OutputStruct
// as OpenAI. 😪
export const OutputStruct = z.object({
  activityDurationMins: z
    .number()
    .describe('The duration the user wrote for the activity.')
    .nullable(),
  reasoning: z
    .string()
    .describe('The reasoning behind the positive or negative feedback.'),
  feedbackType: z
    .string()
    .describe(
      // Is this the best we can do?
      'Enum "lacking-duration" | "unclear-apps". The type of feedback to give the user. Choose null if the activity description is good.'
    )
    .nullable(),
})

export type Output = z.infer<typeof OutputStruct>

export async function getGoalFeedbackFromGemini(
  client: OpenAICompatibleGeminiClient,
  goal: string
): Promise<Result<GoalFeedback>> {
  const res = await safeOpenAIStructuredCompletion<Output>(client, {
    model: 'gemini-2.0-flash',
    messages: [
      {
        role: 'system',
        // Use the system prompt from OpenAI if it's good enough...
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Goal: "${goal}"`,
      },
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(OutputStruct, 'GoalFeedback'),
  })

  if ('error' in res) {
    warn('[ai/gemini/goal-feedback] Error getting goal feedback', res)
    return res
  }

  log('[ai/gemini/goal-feedback] result', res)

  const feedbackType = res.data.feedbackType
  if (
    feedbackType &&
    feedbackType !== 'lacking-duration' &&
    feedbackType !== 'unclear-apps'
  ) {
    warn('[ai/gemini/goal-feedback] Invalid feedback type', res.data)
    return {
      error: 'unknown',
      message: `Invalid feedback type (${feedbackType})`,
    }
  }

  return {
    data: {
      ...res.data,
      feedbackType: feedbackType as GoalFeedback['feedbackType'],
    },
  }
}
