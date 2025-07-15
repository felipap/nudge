import { OpenAI } from 'openai'
// @ts-ignore
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { z } from 'zod'
import { debug, log, warn } from '../../../lib/logger'

type ModelError =
  | 'unknown'
  | 'no-api-key'
  | 'bad-api-key'
  | 'rate-limit'
  | 'no-internet'

const AssessmentStruct = z.object({
  screenSummary: z.string(),
  messageToUser: z.string(),
  isFollowingGoals: z.boolean(),
  goalUnclear: z
    .boolean()
    .describe(`Set to true when the goal is absolutely unclear.`),
})

export type Assessment = z.infer<typeof AssessmentStruct>

export type AssessmentResult =
  | {
      data: Assessment
    }
  | {
      error: ModelError
      message?: string
    }

export async function assessFlowWithOpenAI(
  openAIClient: OpenAI,
  base64content: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<AssessmentResult> {
  const systemPrompt = makeSystemPrompt(
    goal,
    customInstructions,
    previousCaptures
  )
  debug('[ai/assess-flow] systemPrompt', systemPrompt)
  debug('[ai/assess-flow] Calling OpenAI...')

  const start = Date.now()

  let result
  try {
    result = await openAIClient.beta.chat.completions.parse({
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
                url: base64content,
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(AssessmentStruct, 'suggestions'),
      max_tokens: 300,
      temperature: 0.6,
    })
  } catch (e) {
    warn('[ai/assess-flow] completion threw!', e)

    if (e instanceof OpenAI.APIConnectionError) {
      return {
        error: 'no-internet',
      }
    }
    if (e instanceof OpenAI.AuthenticationError) {
      return {
        error: 'bad-api-key',
      }
    }
    if (e instanceof OpenAI.RateLimitError) {
      return {
        error: 'rate-limit',
      }
    }

    return {
      error: 'unknown',
      message: e.message,
    }
  }

  const elapsedMs = Date.now() - start

  log('[ai/assess-flow] elapsedMs', `${(elapsedMs / 1000).toFixed(2)}s`)

  const parsed = result.choices[0].message.parsed
  if (!parsed) {
    return {
      error: 'unknown',
      message: 'No content in result',
    }
  }

  // log('[ai/assess-flow] assessment', parsed)

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
You're a productivity buddy that helps the user keep it's promises.

Instructions:
1. Given a screenshot of the user's screen, provide a summary of what you see.
2. Read the user's desired activity and decide if they are doing what they said they'd do.
3. If not, write a very short (<300 chars) message nudging the user back into flow. Be creative.
4. DON'T be pedantic, DON'T split hairs, DON'T be annoying.

<USER_DESIRED_ACTIVITY>
${goal}
</USER_DESIRED_ACTIVITY>

${
  customInstructions
    ? `<USER_CUSTOM_INSTRUCTIONS>
${customInstructions}
</USER_CUSTOM_INSTRUCTIONS>`
    : ''
}

<PREVIOUS_CAPTURES>
${previousCaptures.map((capture) => `- ${capture}`).join('\n')}
</PREVIOUS_CAPTURES>

Your response should follow this JSON structure:
{
  "screenSummary": "The user is...",
  "isFollowingGoals": boolean,
  "messageToUser": string,
  "goalUnclear": boolean
}

For your screen summary, make sure to touch on:

* What is the top most visible window? What about the second and the third, if any?
* Is the user working? If so, what does the user seem to be working on?
* Is the user breaking their goals? If so, how?
* Any other relevant information?

Set goalUnclear to true when the goal is absolutely unclear.`
}
