import OpenAI from 'openai'
import type { AvailableModel } from '../../../windows/shared/available-models'

export interface ActivatedModel {
  model: AvailableModel
  apiKey: string
}

export async function checkModelApiKey(
  model: AvailableModel,
  apiKey: string
): Promise<boolean> {
  if (model === 'openai-4o' || model === 'openai-4o-mini') {
    return checkOpenAIKey(apiKey)
  }

  throw new Error(`Unknown model: ${model}`)
}

async function checkOpenAIKey(apiKey: string) {
  const openai = new OpenAI({ apiKey })
  const models = await openai.models.list()
  return models.data.length > 0
}
