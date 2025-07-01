import assert from 'assert'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { OpenAI } from 'openai'
// @ts-ignore
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import { z } from 'zod'
import { VERBOSE } from '../config'
import { log, warn } from '../logger'

dayjs.extend(relativeTime)

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
      error: 'unknown' | 'api-key' | 'rate-limit' | 'no-internet'
      message?: string
    }

export async function assessFlowFromScreenshot(
  client: OpenAI,
  base64content: string,
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
): Promise<AssessmentResult> {
  assert(goal, 'goal is required')

  const systemPrompt = makeSytemPrompt(
    goal,
    customInstructions,
    previousCaptures
  )
  if (VERBOSE) {
    log('[ai/assessment] systemPrompt', systemPrompt)
  }

  log('[ai/assessment] Calling OpenAI...')
  const start = Date.now()

  let result
  try {
    result = await client.beta.chat.completions.parse({
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
                // url: `data:image/jpeg;base64,${contents}`,
                url: base64content,
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(AssessmentStruct, 'suggestions'),
      max_tokens: 300,
      temperature: 0.3,
    })
  } catch (e) {
    warn('[ai/assessment] completion threw!', e)

    console.log(
      'is instance APIConnectionError',
      e instanceof OpenAI.APIConnectionError
    )
    console.log('is instance Auth', e instanceof OpenAI.AuthenticationError)
    console.log('is instance RateLimit', e instanceof OpenAI.RateLimitError)
    console.log('is instance APIError', e instanceof OpenAI.APIError)

    if (e instanceof OpenAI.APIConnectionError) {
      return {
        error: 'no-internet',
      }
    }
    if (e instanceof OpenAI.AuthenticationError) {
      return {
        error: 'api-key',
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

  log('[ai/assessment] elapsedMs', `${(elapsedMs / 1000).toFixed(2)}s`)

  const parsed = result.choices[0].message.parsed
  assert(parsed, 'No content in result')

  log('[ai/assessment] assessment', parsed)

  return {
    data: parsed,
  }
}

function makeSytemPrompt(
  goal: string,
  customInstructions: string | null,
  previousCaptures: string[]
) {
  return `You're a productivity buddy that helps the user keep it's promises.

(1) You'll be given a screenshot of the user's screen and you'll be asked to provide a summary of what you see.
(2) Then, read the user's goals below and figure out if what you see is OK by their stated goals.
(3) If the user is breaking their goals, provide a very short (<300 chars) message nudging the user back on track. Try different angles to get their attention.

<USER_GOALS>
${goal}
</USER_GOALS>

<USER_CUSTOM_INSTRUCTIONS>
${customInstructions || 'none'}
</USER_CUSTOM_INSTRUCTIONS>

<PREVIOUS_CAPTURES>
${previousCaptures.map((capture) => `- ${capture}`).join('\n')}
</PREVIOUS_CAPTURES>

Your response should follow:
{
  "screenSummary": "The user is...",
  "isFollowingGoals": boolean,
  "messageToUser": string,
}

For your screen summary, make sure to touch on:

* What is the top most visible window? What about the second and the third, if any?
* Is the user working? If so, what does the user seem to be working on?
* Is the user breaking their goals? If so, how?
* Any other relevant information?
`
}
