import assert from 'assert'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import OpenAI from 'openai'
import { ChatCompletionParseParams } from 'openai/src/resources/beta/chat/completions'
import {
  AvailableModel,
  ModelError,
} from '../../../windows/shared/shared-types'
import { ModelSelection } from '../../store'
import { warn } from '../logger'

export async function validateModelKey(
  model: AvailableModel,
  key: string
): Promise<boolean> {
  if (model === 'openai-4o' || model === 'openai-4o-mini') {
    const isValid = await checkOpenAIKey(key)
    console.log('isValid', isValid)
    return isValid
  }

  throw new Error(`Unknown model: ${model}`)
}

async function checkOpenAIKey(apiKey: string) {
  const openai = new OpenAI({ apiKey })
  try {
    const models = await openai.models.list()
    return models.data.length > 0
  } catch (error) {
    console.error('Error checking OpenAI key', error)
    return false
  }
}

// interface Model {
//   name: AvailableModel
// }

dayjs.extend(relativeTime)

export interface ModelClient {
  provider: 'openai'
  openAiClient: OpenAI
}

export function getModelClient(model: ModelSelection): ModelClient {
  assert(model.key, 'Model key is required')
  assert(model.name === 'openai-4o')

  return {
    provider: 'openai',
    openAiClient: new OpenAI({
      apiKey: model.key,
    }),
  }
}

export async function safeOpenAIStructuredCompletion<T>(
  client: ModelClient,
  options: Omit<ChatCompletionParseParams, 'response_format'> &
    // There's probably a way to infer T from `response_format` but fuck it.
    Required<Pick<ChatCompletionParseParams, 'response_format'>>
): Promise<{ data: T } | { error: ModelError; message?: string }> {
  let result
  try {
    result = await client.openAiClient.beta.chat.completions.parse({
      ...options,
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

  return {
    data: result.choices[0].message.parsed as T,
  }
}
