import { getOpenAiClient } from './index'
import { z } from 'zod'
import { zodResponseFormat } from 'openai/helpers/zod'

const GoalFeedbackSchema = z.object({
  isGood: z.boolean(),
  feedback: z.string(),
})

export type GoalFeedback = z.infer<typeof GoalFeedbackSchema>

export async function getGoalFeedback(
  goal: string,
  openAiKey: string
): Promise<GoalFeedback> {
  const client = getOpenAiClient(openAiKey)

  const systemPrompt = `You are an AI that helps users stay focused by monitoring their screen.
A good goal tells us:
1. What we'll see on screen (coding, writing, reading, messaging, etc)
2. A time block or clear deliverable

Examples:
- "Work on Nudge" -> Ask what they'll be doing (coding? writing docs?)
- "Code project" -> Ask for a time block
- "Code on Nudge for 2 hours" -> Return isGood=true with no explanation
- "Text friends for 30 minutes" -> Return isGood=true with no explanation

Communication activities (texting, messaging, emails) are valid screen activities when paired with a time block.
If they mention a screen activity AND a time block, return isGood=true with no explanation.
If either is missing, return isGood=false with a feedback asking for clarification.

Instructions:
* Don't use "Please". You're giving the user a suggestion, not a request. `

  try {
    const response = await client.beta.chat.completions.parse({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Goal: "${goal}"`,
        },
      ],
      temperature: 0.2,
      response_format: zodResponseFormat(GoalFeedbackSchema, 'GoalFeedback'),
    })

    const parsed = response.choices[0].message.parsed
    console.log('[ai/goal-feedback] parsed', parsed)
    return parsed
  } catch (error) {
    console.error('Error getting goal feedback:', error)
    throw error
  }
}
