import { app } from 'electron'
import { NUDGE_AI_BASE_URL } from '../config'
import { warn } from '../logger'
import { ellipsis } from '../utils'
import { genSignedFingerprint } from './fingerprint'

export interface SignatureHeaders {
  'x-computer-id': string
  'x-os-platform': string
  'x-os-arch': string
  'x-nudge-version': string
}

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
    headers = getFingerprintHeaders()
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
        ...init.headers,
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

function getFingerprintHeaders(): Record<string, string> {
  // I think this can throw?
  const verifiees = genSignedFingerprint()

  const headers: Record<string, string> = {
    'x-nudge-version': app.getVersion(),
    'user-agent': `Nudge/${app.getVersion()}`,
    'x-computer-id': verifiees.computerId,
    'x-os-platform': verifiees.osInfo.platform,
    'x-os-arch': verifiees.osInfo.arch,
    // 'x-verification-timestamp': verifiees.timestamp.toString(),
  }

  return headers
}
