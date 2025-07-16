// README Try to make this whole folder independent of the rest of the codebase
// so we can sync it between **nudge** and **nudge-web**.
//
// Ie. sync `nudge/src/lib/ai/openai` with `nudge-web/ai/openai`

import OpenAI from 'openai'
import { ChatCompletionParseParams } from 'openai/resources/chat/completions'
import { captureException, warn } from './oai-logger'

// Utils below

type CallError =
  | 'unknown'
  | 'no-api-key'
  | 'bad-api-key'
  | 'rate-limit'
  | 'no-internet'

// Signature for the openai functions.
export type Result<D> =
  | {
      data: D
    }
  | {
      error: CallError
      message?: string
    }

export async function safeOpenAIStructuredCompletion<T>(
  client: OpenAI,
  options: Omit<ChatCompletionParseParams, 'response_format'> &
    // There's probably a way to infer T from `response_format` but fuck it.
    Required<Pick<ChatCompletionParseParams, 'response_format'>>
): Promise<{ data: T } | { error: CallError; message?: string }> {
  let result
  try {
    result = await client.chat.completions.parse({
      ...options,
    })
  } catch (e) {
    warn('[ai/openai] completion threw!', e)

    captureException(e, {
      extra: {
        message: 'KNOWN OpenAI API error',
        model: client.apiKey,
      },
    })

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

    warn('Unknown OpenAI API error', { e })

    captureException(e, {
      extra: {
        message: 'UnknownOpenAI API error',
        model: client.apiKey,
      },
    })

    return {
      error: 'unknown',
      message: e.message,
    }
  }

  return {
    data: result.choices[0].message.parsed as T,
  }
}
