import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import chalk from 'chalk'
import { debug, log, warn } from '../oai-logger'
import { Result, safeOpenAIStructuredCompletion } from '../utils'

const OutputStruct = z.object({
  screenSummary: z.string(),
  notificationToUser: z.string(),
  isFollowingGoals: z.boolean(),
  goalUnclear: z
    .boolean()
    .describe(`Set to true when the goal is absolutely unclear.`),
})

export type Output = z.infer<typeof OutputStruct>

export async function assessFlowWithOpenAI(
  client: OpenAI,
  imageBase64: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<Result<Output>> {
  const systemPrompt = makeSystemPrompt(
    goal,
    customInstructions,
    previousCaptures
  )

  debug('[ai/openai/assess-capture] prompt\n', chalk.gray(systemPrompt))
  debug('[ai/openai/assess-capture] calling')

  const start = Date.now()

  const result = await safeOpenAIStructuredCompletion<Output>(client, {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageBase64,
            },
          },
        ],
      },
    ],
    response_format: zodResponseFormat(OutputStruct, 'suggestions'),
    max_tokens: 300,
    temperature: 0.6,
  })

  if ('error' in result) {
    warn('[ai/openai/assess-capture] error', result)
    return result
  }

  const elapsedMs = Date.now() - start

  debug(
    '[ai/openai/assess-capture] elapsedMs',
    `${(elapsedMs / 1000).toFixed(2)}s`
  )

  const parsed = result.data
  if (!parsed) {
    return {
      error: 'unknown',
      message: 'No content in result',
    }
  }

  log('[ai/openai/assess-capture] result', parsed)

  return {
    data: parsed,
  }
}

function makeSystemPrompt(
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
) {
  return `
You're a productivity assistant that notifies the user when they look distracted.

Instructions:
1. Given a screenshot of the user's screen, provide a summary of what you see, regardless of the user's intended activity.
2. Read the user's desired activity and decide if they are doing what they said they'd do.
3. If not, write a very short (<200 chars) message nudging the user back into flow. Be creative.
4. DON'T be annoying, pedantic or split hairs.
4.1. Consider that the user may be _starting_ the task at hand.
5. Chill with the exclamation marks.

<USER_INTENDED_ACTIVITY>
${goal}
</USER_INTENDED_ACTIVITY>

${
  customInstructions
    ? `<USER_CUSTOM_INSTRUCTIONS>
${customInstructions}
</USER_CUSTOM_INSTRUCTIONS>`
    : ''
}

${
  previousCaptures.length > 0
    ? `<PREVIOUS_CAPTURES>
${previousCaptures.map((capture) => `- ${capture}`).join('\n')}
</PREVIOUS_CAPTURES>`
    : ''
}

Your response should follow this JSON structure:
{
  "screenSummary": "The user is...",
  "isFollowingGoals": boolean,
  "notificationToUser": string, // <120 chars
  "goalUnclear": boolean
}

For your screen summary, make sure to touch on:

* What is the top most visible window? What about the second and the third, if any?
* Is the user working? If so, what does the user seem to be working on?
* Is the user breaking their goals? If so, how?
* Any other relevant information?

Set goalUnclear to true when the goal is absolutely unclear.`
    .trim()
    .replace(/\n\n\n+/g, '\n\n')
}
