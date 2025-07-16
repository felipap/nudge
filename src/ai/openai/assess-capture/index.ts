import { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import { debug, log, warn } from '../oai-logger'
import { Result, safeOpenAIStructuredCompletion } from '../utils'

const OutputStruct = z.object({
  screenSummary: z.string(),
  messageToUser: z.string(),
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

  debug('[ai/openai/assess-capture] prompt', systemPrompt)
  log('[ai/openai/assess-capture] calling')

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

  log(
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
