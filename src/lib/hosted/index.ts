import { ApiResult, callNudgeAPI } from './api'

export * from './api'
export * from './fingerprint'

export async function heartbeat(): Promise<
  ApiResult<{ status: string; timestamp: string; version: string }>
> {
  return callNudgeAPI('/heartbeat', { method: 'GET' })
}
