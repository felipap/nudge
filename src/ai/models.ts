import assert from 'assert'
import OpenAI from 'openai'
import { AvailableProvider } from '../../windows/shared/shared-types'
import { debug, logError, warn } from '../lib/logger'
import { getState, ProviderSelection } from '../store'

export async function validateModelKey(
  model: AvailableProvider,
  key: string
): Promise<boolean> {
  if (model === 'openai' || model === 'openai-4o-mini') {
    const isValid = await checkOpenAIKey(key)
    debug('isValid', isValid)
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
    logError('Error checking OpenAI key', { error })
    return false
  }
}

export interface ModelClient {
  provider: 'openai'
  openAiClient: OpenAI
}

export type BackendClient = ModelClient | { provider: 'nudge' }

export function getAiBackendClient(): BackendClient | null {
  const useNudgeCloud = getState().useNudgeCloud

  if (useNudgeCloud) {
    return { provider: 'nudge' }
  }

  const modelSelection = getState().modelSelection
  if (!modelSelection) {
    warn('[capture] No OpenAI key found')
    return null
  }

  const openai = getModelClient(modelSelection)
  return openai
}

export function getModelClient(model: ProviderSelection): ModelClient {
  assert(model.key, 'Model key is required')
  // assert(model.name === 'openai-4o')

  return {
    provider: 'openai',
    openAiClient: new OpenAI({
      apiKey: model.key,
    }),
  }
}
