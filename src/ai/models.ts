import assert from 'assert'
import OpenAI from 'openai'
import { AvailableProvider } from '../../windows/shared/shared-types'
import { debug, logError, warn } from '../lib/logger'
import { getState, ProviderSelection } from '../store'

export async function validateModelKey(
  provider: AvailableProvider,
  key: string
): Promise<boolean> {
  if (provider === 'openai') {
    const isValid = await checkOpenAIKey(key)
    debug('openai isValid', isValid)
    return isValid
  }
  if (provider === 'gemini') {
    const isValid = await checkGeminiKey(key)
    debug('gemini isValid', isValid)
    return isValid
  }
  if (provider === 'nudge') {
    return true
  }

  throw new Error(`Unknown provider: ${provider}`)
}

async function checkGeminiKey(apiKey: string) {
  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  })
  try {
    const models = await openai.models.list()
    return models.data.length > 0
  } catch (error) {
    logError('Error checking OpenAI key', { error })
    return false
  }
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

export type ModelClient =
  | {
      provider: 'openai'
      openAiClient: OpenAI
    }
  | {
      provider: 'gemini'
      key: string
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

  if (model.name === 'gemini') {
    return {
      provider: 'gemini',
      key: model.key,
    }
  }

  return {
    provider: 'openai',
    openAiClient: new OpenAI({
      apiKey: model.key,
    }),
  }
}
