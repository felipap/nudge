import { app } from 'electron'
import { NUDGE_AI_BASE_URL } from '../config'
import { warn } from '../logger'
import { ellipsis } from '../utils'
import { generateVerificationData } from './verification'

export type ApiError =
  | 'no-internet'
  | 'rate-limit'
  | 'unknown'
  | 'verification-failed'

export type ApiResult<T> = { data: T } | { error: string; message?: string }

/**
 * Issues a POST by default.
 */
export async function callNudgeAPI<T>(
  endpoint: string,
  body: Record<string, unknown>,
  init: Omit<RequestInit, 'body'> = {}
): Promise<ApiResult<T>> {
  const url = `${NUDGE_AI_BASE_URL}${endpoint}`

  let headers
  try {
    headers = getHeaders()
  } catch (e) {
    warn('[hosted/api] Error generating verification data', e)
    throw e
  }

  let res
  let text
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
      ...init,
    })
    text = await res.text()
  } catch (e) {
    warn('[hosted/api] fetch threw', e)
    return { error: 'no-internet' }
  }

  if (!res.ok) {
    const message = `url=${url} status=${res.status} text=${ellipsis(text)}`

    // TODO: coordinate these with backend
    if (res.status === 503) {
      return { error: 'no-internet', message }
    }
    if (res.status === 429) {
      return { error: 'rate-limit', message }
    }
    if (res.status === 500) {
      return {
        error: 'unknown',
        message,
      }
    }

    return { error: 'unknown', message }
  }

  let json
  try {
    json = JSON.parse(text)
  } catch (e) {
    warn('[hosted/api] Failed to parse response as JSON', {
      status: res.status,
      url,
      text: ellipsis(text),
      error: e,
    })
    return { error: 'unknown', message: 'Invalid JSON response' }
  }

  if (json.error) {
    return { error: json.error, message: json.message }
  }

  return { data: json.data }
}

export async function heartbeat(): Promise<
  ApiResult<{ status: string; timestamp: string; version: string }>
> {
  return callNudgeAPI('/heartbeat', { method: 'GET' })
}

function getHeaders(): Record<string, string> {
  // I think this can throw?
  const verifiees = generateVerificationData()

  return {
    'X-Nudge-Version': app.getVersion(),
    'User-Agent': `Nudge/${app.getVersion()}`,
    'X-Computer-ID': verifiees.computerId,
    'X-Verification-Signature': verifiees.signature,
    'X-Verification-Timestamp': verifiees.timestamp.toString(),
    'X-Hardware-Fingerprint': verifiees.hardwareFingerprint,
    'X-OS-Platform': verifiees.osInfo.platform,
    'X-OS-Arch': verifiees.osInfo.arch,
  }
}
