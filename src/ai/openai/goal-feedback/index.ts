import { OpenAI } from 'openai'
// @ts-ignore
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { warn } from '../../../lib/logger'
import {
  GoalFeedback,
  GoalFeedbackResult,
  GoalFeedbackStruct,
} from '../../goal-feedback'
import { safeOpenAIStructuredCompletion } from '../../models'

const SYSTEM_PROMPT = `You are an AI that helps users stay focused by monitoring their screen.
A good goal tells us:
1. What apps we'll see on screen or what activity they'll be doing (coding, writing, reading, messaging, etc)
2. A time block or clear deliverable

We don't care about deliverables. What's important is that we're able to tell WHEN the user is procrastinating or not.

Examples:
- "Work on Nudge" -> Ask what they'll be doing (coding? writing docs?)
- "Code project" -> Ask for a time block
- "Code on Nudge for 2 hours" -> Return feedbackType=null
- "Text friends for 30 minutes" -> Return feedbackType=null
- "Write for 20 mins" -> Return feedbackType="lacking-duration"

Communication activities (texting, messaging, emails) are valid screen activities when paired with a time block.
If they mention an activity AND a time block, return feedbackType=null and feedback=null.
If either is missing, return feedbackType="lacking-duration" or feedbackType="unclear-apps".

Instructions:
* Make only one reccomendation at a time.
* Be extremely succinct. Example: "Mention which apps are ok to use."
* Don't use "Please". You're giving the user a suggestion, not a request.
`

export async function getGoalFeedbackFromOpenAI(
  client: OpenAI,
  goal: string
): Promise<GoalFeedbackResult> {
  const res = await safeOpenAIStructuredCompletion<GoalFeedback>(client, {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Goal: "${goal}"`,
      },
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(GoalFeedbackStruct, 'GoalFeedback'),
  })

  if ('error' in res) {
    warn('[ai/goal-feedback] Error getting goal feedback', res)
    return res
  }

  return res
}
