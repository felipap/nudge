import { app } from 'electron'
import { machineIdSync } from 'node-machine-id'
import { NUDGE_AI_BASE_URL } from './config'
import { warn } from './logger'
import { ellipsis } from './utils'

export async function heartbeat(): Promise<
  ApiResult<{ status: string; timestamp: string; version: string }>
> {
  return callNudgeAPI('/heartbeat', { method: 'GET' })
}

//

export interface SignatureHeaders {
  'x-computer-id': string
  'x-os-platform': string
  'x-os-arch': string
  'x-nudge-version': string
}

export type ApiError = 'no-internet' | 'rate-limit' | 'unknown'

export type ApiResult<T> = { data: T } | { error: ApiError; message?: string }

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

export function getComputerId(): string {
  return machineIdSync()
}

export interface SignedFingerPrint {
  computerId: string
  // timestamp: number
  // signature: string
  // hardwareHash: string
  osInfo: {
    platform: string
    arch: string
    version: string
  }
}

/**
 * Used in requests to the the hosted Nudge endpoint.
 */
export function genSignedFingerprint(): SignedFingerPrint {
  const computerId = machineIdSync()
  // const timestamp = Date.now()

  // Create a hardware fingerprint from multiple sources
  // const hardwareHash = genHardwareHash()

  // Create a signature that includes the computer ID and timestamp
  // const signature = createSignature(computerId, timestamp, hardwareHash)

  return {
    computerId,
    // timestamp,
    // signature,
    // hardwareHash,
    osInfo: {
      platform: process.platform,
      arch: process.arch,
      version: process.getSystemVersion?.() || 'unknown',
    },
  }
}

// function genHardwareHash(): string {
//   const fingerprints: string[] = []

//   try {
//     // CPU info
//     const cpuInfo = execSync('sysctl -n machdep.cpu.brand_string', {
//       encoding: 'utf8',
//     }).trim()
//     fingerprints.push(cpuInfo)
//   } catch (e) {
//     warn('[verification] Could not get CPU info', e)
//   }

//   try {
//     // Machine serial
//     const serial = execSync('ioreg -l | grep IOPlatformSerialNumber', {
//       encoding: 'utf8',
//     })
//     const match = serial.match(/"([^"]+)"/)
//     if (match) {
//       fingerprints.push(match[1])
//     }
//   } catch (e) {
//     warn('[verification] Could not get serial', e)
//   }

//   try {
//     // MAC address
//     const macAddress = execSync(
//       "ifconfig en0 | grep ether | awk '{print $2}'",
//       { encoding: 'utf8' }
//     ).trim()
//     fingerprints.push(macAddress)
//   } catch (e) {
//     warn('[verification] Could not get MAC', e)
//   }

//   // Combine and hash
//   const combined = fingerprints.join('|')
//   return createHash('sha256').update(combined).digest('hex')
// }

// function createSignature(
//   computerId: string,
//   timestamp: number,
//   hardwareHash: string
// ): string {
//   // Create a signature that would be hard to forge
//   const data = `${computerId}|${timestamp}|${hardwareHash}|${process.platform}`

//   // In a real implementation, you might use a secret key here
//   // For now, we'll use a simple hash
//   return createHash('sha256').update(data).digest('hex')
// }
